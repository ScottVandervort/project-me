package com.scottsjewels.android.me.data;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DatabaseHelper extends SQLiteOpenHelper {

    private static final int VERSION = 1;

    // Database gets stored at "/data/data/[application_name]/databases/crimeBase.db".
    private static final String DATABASE_NAME = "database.db";

    public DatabaseHelper (Context context) {
        super( context, DATABASE_NAME, null, VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase) {
        sqLiteDatabase.execSQL("create table " + DatabaseSchema.JournalTable.NAME +
                "(" +
                " _id integer primary key autoincrement, " +
                DatabaseSchema.JournalTable.Cols.UUID + ", " +
                DatabaseSchema.JournalTable.Cols.DESCRIPTION + ", " +
                DatabaseSchema.JournalTable.Cols.DATE + ", " +
                DatabaseSchema.JournalTable.Cols.DATA_TYPE +
                ")" );

    }

    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {

    }
}
