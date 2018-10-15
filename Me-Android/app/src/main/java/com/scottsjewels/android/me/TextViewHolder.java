package com.scottsjewels.android.me;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.scottsjewels.android.me.data.models.JournalEntry;

public class TextViewHolder extends BaseViewHolder {
    public TextViewHolder( View view ) {
        super(view);
    }

    // ViewHolder's need to maintain their own Layouts, too.
    public TextViewHolder(LayoutInflater inflater, ViewGroup parent) {

        // Call another constructor.
        this(inflater.inflate(R.layout.list_item_text, parent, false));
    }

    @Override
    public void bind(JournalEntry journalEntry) {

    }
}
