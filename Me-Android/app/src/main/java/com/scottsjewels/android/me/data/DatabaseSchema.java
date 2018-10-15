package com.scottsjewels.android.me.data;

public class DatabaseSchema {
    public static final class JournalTable {
        public static final String NAME = "journalEntries";

        public static final class Cols {
            public static final String UUID = "uuid";
            public static final String DESCRIPTION = "title";
            public static final String DATE = "date";
            public static final String DATA_TYPE = "dataType";
        }
    }
}

