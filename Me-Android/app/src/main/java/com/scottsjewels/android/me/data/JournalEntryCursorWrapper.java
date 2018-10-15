package com.scottsjewels.android.me.data;

import android.database.Cursor;
import android.database.CursorWrapper;
import android.util.Log;

import com.scottsjewels.android.me.data.models.JournalEntry;
import com.scottsjewels.android.me.data.models.JournalEntryType;

import java.util.Date;
import java.util.UUID;

/*
    Wrapper to help with JournalEntry cursor.

    A CursorWrapper encapsulates repetitive interactions with the Cursor.

    You can create new methods that don't exist in the base Cursor.
 */
public class JournalEntryCursorWrapper extends CursorWrapper {

    private static final String LOG_TAG = DataSource.class.getName();

    /**
     * Constructor.
     * @param cursor The cursor to wrap.
     */
    public JournalEntryCursorWrapper( Cursor cursor) {
        super( cursor);
    }

    /**
     * Gets the Journal Entry pointed to by the Cursor.
     * @return The Journal Entry.
     */
    public JournalEntry getJournalEntry() {

        String uuidString = "";
        String description = "";
        long date = 0l;
        JournalEntryType dataType = JournalEntryType.TEXT_ENTRY;

        // Translate the values from the database / cursor.
        try {
            uuidString = getString(getColumnIndex(DatabaseSchema.JournalTable.Cols.UUID));
            description = getString(getColumnIndex(DatabaseSchema.JournalTable.Cols.DESCRIPTION));
            date = getLong(getColumnIndex(DatabaseSchema.JournalTable.Cols.DATE));
            dataType = JournalEntryType.valueOf(getInt(getColumnIndex(DatabaseSchema.JournalTable.Cols.DATA_TYPE)));
        }
        catch (Exception ex) {
            Log.e(LOG_TAG, "There was a problem converting data from the database into a JournalEntry object!");
            throw ex;
        }

        // Create a instance of JournalEntry given the values.
        JournalEntry journalEntry = new JournalEntry( UUID.fromString( uuidString));
        journalEntry.setDescription( description);
        journalEntry.setDate( new Date( date));
        journalEntry.setType( dataType );

        return journalEntry;
    }
}