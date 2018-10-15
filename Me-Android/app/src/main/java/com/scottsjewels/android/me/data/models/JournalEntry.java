package com.scottsjewels.android.me.data.models;

import java.util.Date;
import java.util.UUID;

/**
 * A Journal Entry.
 */
public class JournalEntry {

    private JournalEntryType mType;
    private UUID mId;
    private Date mDate;
    private String mDescription;

    public JournalEntry() {
        this( UUID.randomUUID());
    }

    public JournalEntry ( UUID id ) {
        mId = id;
        mDate = new Date();
    }

    public JournalEntryType getType() {
        return mType;
    }

    public void setType(JournalEntryType type) {
        mType = type;
    }

    public UUID getId() {
        return mId;
    }

    public void setId(UUID id) {
        mId = id;
    }

    public String getPhotoFilename() {
        return "IMG_" + getId().toString() + ".jpg";
    }

    public Date getDate() {
        return mDate;
    }

    public void setDate(Date date) {
        mDate = date;
    }

    public String getDescription() {
        return mDescription;
    }

    public void setDescription(String description) {
        mDescription = description;
    }
}
