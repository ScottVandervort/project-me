package com.scottsjewels.android.me;

import android.support.v7.widget.RecyclerView;
import android.view.View;

import com.scottsjewels.android.me.data.models.JournalEntry;

abstract public class BaseViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {

    public BaseViewHolder( View view ) {
        super(view);
    }

    abstract public void bind ( JournalEntry journalEntry);

    @Override
    public void onClick(View view) {
    }
}
