package com.scottsjewels.android.me;


import android.app.Activity;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.DialogFragment;
import android.support.v7.app.AlertDialog;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.DatePicker;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DatePickerFragment extends DialogFragment {

    public static final String DATE = "com.scottsjewels.android.me.date";

    private DatePicker mDatePicker;
    private Button mDateOkayButton;

    /***
     * Factory method to create an instance of DatePickerFragment.
     * @param date The date to pass to the DatePickerFragment.
     * @return An instance of DatePickerFragment.
     */
    public static DatePickerFragment newInstance(Date date) {

        Bundle args = new Bundle();
        args.putSerializable(DATE, date);

        DatePickerFragment fragment = new DatePickerFragment();
        fragment.setArguments( args);

        return fragment;
    }


    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        // This is ALWAYS called regardless if being invoked as a Dialog or being displayed in a
        // an Activity. Skip this code if being displayed as a Dialog as onCreateDialog() will do
        // the same thing and more.
        if (this.getDialog() != null)
            return super.onCreateView(inflater, container, savedInstanceState);

        Date date = (Date) getArguments().getSerializable(DATE);

        View v = LayoutInflater.from( getActivity()).inflate( R.layout.dialog_date, null);

        setDateOnView(date,v);

        // Show the "Okay" button - it's only used if displaying the Date Picker full-screen ( non-dialog ).
        mDateOkayButton = (Button) v.findViewById( R.id.dialog_ok_date);
        mDateOkayButton.setVisibility(View.VISIBLE);

        // .. and hook up an event listener,
        mDateOkayButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Send the Result to hosting Fragment / Activity.
                sendResult( Activity.RESULT_OK, parseDateFromView());

                getActivity().onBackPressed();
            }
        });

        return v;
    }

    // This is invoked from the parent when DialogFragment.show() is called.
    @Override public Dialog onCreateDialog(Bundle savedInstanceState) {

        // Get the date from the Arguments sent into this Fragment.
        Date date = (Date) getArguments().getSerializable(DATE);

        // Get the view/layout to display in the Dialog.
        View v = LayoutInflater.from( getActivity()).inflate( R.layout.dialog_date, null);

        setDateOnView(date,v);

        // Hide the "Okay" button - it's only used if displaying the Date Picker full-screen ( non-dialog ).
        mDateOkayButton = (Button) v.findViewById( R.id.dialog_ok_date);
        mDateOkayButton.setVisibility(View.INVISIBLE);

        // Create a Dialog using factory method. Dialogs can accept layouts! Can also assign buttons
        // and hook up event handlers.
        return new AlertDialog.Builder(getActivity())
                .setView(v)
                .setTitle( R.string.date_picker_title)
                .setPositiveButton(
                        android.R.string.ok,
                        new DialogInterface.OnClickListener() {

                            // Attach a click listener to the "OK" button on the Dialog.
                            @Override public void onClick(DialogInterface dialog, int which) {

                                // Send the Result to hosting Fragment / Activity.
                                sendResult( Activity.RESULT_OK, parseDateFromView());
                            }
                        })
                .create();
    }

    private void setDateOnView (Date date, View view) {
        // Parse the Date so that it can be displayed in the Calndar View.
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        int year = calendar.get( Calendar.YEAR);
        int month = calendar.get( Calendar.MONTH);
        int day = calendar.get( Calendar.DAY_OF_MONTH);

        // Get the Calendar View from the Layout and initialize the date on it.
        mDatePicker = (DatePicker) view.findViewById( R.id.dialog_date_picker);
        mDatePicker.init( year, month, day, null);
    }

    private Date parseDateFromView () {
        // Parse the Date from the Date/Calendar View hosted by the Dialog.
        int year = mDatePicker.getYear();
        int month = mDatePicker.getMonth();
        int day = mDatePicker.getDayOfMonth();

        Date date = new GregorianCalendar( year, month, day).getTime();

        return date;
    }

    private void sendResult( int resultCode, Date date) {

        // Only Activities can have results. Prepare an Intent to send back to the target.
        Intent intent = new Intent();
        intent.putExtra( DATE, date);

        // If this was was invoked as a Dialog a target fragment was specified using
        // DatePickerFragment.setTargetFragment().
        if (getTargetFragment() == null) {
            // ... nope. Was launched in an Activity ( or a Fragment hosted within an Activity ).
            this.getActivity().setResult( Activity.RESULT_OK, intent);
        }
        else {
            // Manually call onActivityResult(). This is usually automatically called by the Activity
            // Manager on the hosting Activity when a Child Activity "returns".
            // Since the host is a Fragment this method needs to be explicitly called.
            // The Fragment can then extract any extras attached to it.
            getTargetFragment().onActivityResult(getTargetRequestCode(), resultCode, intent);
        }
    }

}
