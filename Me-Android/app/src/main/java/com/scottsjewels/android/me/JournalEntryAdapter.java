package com.scottsjewels.android.me;

import android.support.v7.widget.RecyclerView;
import android.view.ViewGroup;

import com.scottsjewels.android.me.data.models.JournalEntry;

import java.util.List;

public class JournalEntryAdapter extends RecyclerView.Adapter <BaseViewHolder> {

    private List<JournalEntry> mJournalEntries;

    public void setJournalEntries( List<JournalEntry> journalEntries ) {
        mJournalEntries = journalEntries;

    }

    public JournalEntryAdapter(List<JournalEntry> journalEntries) {
        mJournalEntries = journalEntries;
    }

    @Override
    public BaseViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        return null;
    }

    @Override
    public void onBindViewHolder(BaseViewHolder holder, int position) {
    }

    @Override
    public int getItemViewType(int position) {
        return 0;
    }

    // The number of items to display.
    @Override
    public int getItemCount() {
        return 0;
    }
}
