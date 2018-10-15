package com.scottsjewels.android.me.data.models;

import java.util.HashMap;
import java.util.Map;

/**
 * Types of Journal Entries
 * @see <a href="https://codingexplained.com/coding/java/enum-to-integer-and-integer-to-enum">Enum to Integer and Integer to Enum in Java</a>
 */
public enum JournalEntryType {
    PHOTO_ENTRY(1),
    TEXT_ENTRY(2),
    HEADER_ENTRY(3);

    private int value;
    private static Map map = new HashMap<>();

    private JournalEntryType(int value) {
        this.value = value;
    }

    static {
        for (JournalEntryType pageType : JournalEntryType.values()) {
            map.put(pageType.value, pageType);
        }
    }

    public static JournalEntryType valueOf(int journalEntryType) {
        return (JournalEntryType) map.get(journalEntryType);
    }

    public int getValue() {
        return value;
    }
}
