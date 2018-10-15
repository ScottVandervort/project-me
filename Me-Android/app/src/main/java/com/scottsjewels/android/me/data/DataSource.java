package com.scottsjewels.android.me.data;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.scottsjewels.android.me.data.models.JournalEntry;
import com.scottsjewels.android.me.data.models.JournalEntryType;

/**
 * Data Access Layer.
 */
public class DataSource {

    private static final String LOG_TAG = DataSource.class.getName();

    private static DataSource sDataSource;

    private Context mContext;
    private SQLiteDatabase mDatabase;

    /**
     * Gets the singleton DataSource instance.
     * @param context The context to which the database handle should be attached.
     * @return
     */
    public static DataSource get(Context context) {
        if (sDataSource == null) {
            sDataSource = new DataSource(context);
        }

        return sDataSource;
    }

    /**
     * Closes the database connection. Since this is a singleton the connection will be closed for ALL
     * consumers!
     */
    public void close() {
        if (mDatabase != null && mDatabase.isOpen()) {
            try {
                mDatabase.close();
            }
            finally {
                sDataSource = null;
                mContext = null;
            }
        }
    }

    /**
     * ( Private ) Constructor. Data Access is a singleton - don't want to expose constructor publically.
     * @param context
     */
    private DataSource(Context context) {

        // The Database should be created in the Context of the Application - not an Activity.
        // if it were created using an Activity Context the Activity would never be freed if
        // it looses focus.
        mContext = context.getApplicationContext();

        // Get a writable database.
        mDatabase = new DatabaseHelper(mContext).getWritableDatabase();
    }

    /**
     * Get ALL Journal Entries.
     * @return All Journal Entries.
     */
    public List<JournalEntry> getJournalEntries() {

        List<JournalEntry> crimes = new ArrayList<>();

        JournalEntryCursorWrapper cursor = queryJournalEntries(null, null);

        try {
            cursor.moveToFirst();

            while (!cursor.isAfterLast()) {
                crimes.add(cursor.getJournalEntry());
                cursor.moveToNext();
            }
        }
        finally {
            cursor.close();
        }

        return crimes;
    }

    /**
     * Retrieves the specified Journal Entry
     * @param id The unique ID of the Journal Entry to retrieve.
     * @return The Journal Entry.
     */
    public JournalEntry getJournalEntry(UUID id) {

        JournalEntryCursorWrapper cursor = queryJournalEntries(
                DatabaseSchema.JournalTable.Cols.UUID + " = ?",
                new String[]{id.toString()});

        try {
            if (cursor.getCount() == 0) {
                return null;
            }

            cursor.moveToFirst();

            return cursor.getJournalEntry();
        } finally {
            cursor.close();
        }
    }

    /**
     * Adds a new Journal Entry
     * @param journalEntry
     */
    public void addJournalEntry(JournalEntry journalEntry) {

        ContentValues values = getContentValues(journalEntry);

        // _id column ( primary key ) is automatically inserted.
        mDatabase.insert(DatabaseSchema.JournalTable.NAME, null, values);
    }

    /**
     * Updates the database with the specified Journal Entry.
     * @param journalEntry
     */
    public void updateJournalEntry(JournalEntry journalEntry) {

        String uuidString = journalEntry.getId().toString();
        ContentValues values = getContentValues(journalEntry);

        // Do not put uuid string directly into where clause. It would be an entry point for SQL Injection.
        mDatabase.update(
                DatabaseSchema.JournalTable.NAME,
                values,
                DatabaseSchema.JournalTable.Cols.UUID + " = ?",
                new String[]{uuidString});
    }

    /**
     * Deletes the specified Journal Entry.
     * @param journalEntryID
     */
    public void removeJournalEntry( UUID journalEntryID) {

        String uuidString = journalEntryID.toString();

        // Do not put uuidstring directly into where clause. It would be an entry point for SQL Injection.
        mDatabase.delete(
                DatabaseSchema.JournalTable.NAME,
                DatabaseSchema.JournalTable.Cols.UUID + " = ?",
                new String[]{uuidString});
    }

    /**
     * Get the photo for the journal entry.
     * @param journalEntry The journal entry.
     * @return The journal entry photo.
     */
    public File getPhotoFile (JournalEntry journalEntry) {

        File result = null;

        if (journalEntry == null) {
            Log.w(  LOG_TAG,
                    "Journal entry is NULL.");
        }
        else if (!journalEntry.getType().equals(JournalEntryType.PHOTO_ENTRY)) {
            Log.w(  LOG_TAG,
                    String.format("Attempting to get a photo from a journal entry that is not of type PHOTO_ENTRY. UUID : %s", journalEntry.getId().toString()));
        }
        else {
            // Get the location where files are created in the Applications' sandbox.
            File filesDir = mContext.getFilesDir();
            result = new File( filesDir, journalEntry.getPhotoFilename());
        }

        return result;
    }


    /**
     * Queries for journal entries.
     * @param whereClause The columns to search. Example : "column1 = ? OR column1 = ?"
     * @param whereArgs The values to search in the whereClause columns.
     * @return A JournalEntryCursorWrapper containing the result set.
     */
    private JournalEntryCursorWrapper queryJournalEntries(String whereClause, String[] whereArgs) {

        Cursor cursor = mDatabase.query(
                DatabaseSchema.JournalTable.NAME,
                null, // columns - null selects all columns
                whereClause,
                whereArgs,
                null, // groupBy
                null, // having null
                null // orderBy
        );

        return new JournalEntryCursorWrapper(cursor);
    }

    /**
     * Converts a JournalEntry into a ContentValues - which is understandable by SQLLite Database.
     * @param journalEntry The Journal Entry.
     * @return A ContentValues object containing the Journal Entry.
     */
    private ContentValues getContentValues (JournalEntry journalEntry ) {

        // ContentValues is a hash in which updates can be submitted to the SQLLite Database.
        ContentValues values = new ContentValues();

        // Translate Journal Entry objects to columns in SQLite DB....
        values.put( DatabaseSchema.JournalTable.Cols.UUID, journalEntry.getId().toString());
        values.put( DatabaseSchema.JournalTable.Cols.DESCRIPTION, journalEntry.getDescription());
        values.put( DatabaseSchema.JournalTable.Cols.DATE, journalEntry.getDate().getTime());
        values.put( DatabaseSchema.JournalTable.Cols.DATA_TYPE, journalEntry.getType().getValue());

        return values;
    }

}
