package com.scottsjewels.android.me;

import android.app.DatePickerDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaScannerConnection;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.DisplayMetrics;
import android.util.Log;
import android.widget.DatePicker;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;

abstract public class BaseActivity extends AppCompatActivity {

    private static final String LOG_TAG = BaseActivity.class.getName();

    /**
     * Has the application been granted these permissions?
     * @param permissions The permissions.
     * @return True, if the application has been granted the specified permissions.
     */
    private boolean hasPermissions(String... permissions) {
        if (permissions != null) {
            for (String permission : permissions) {
                if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Has the application prompted the end-user to grant these permissions?
     * @param permissions The permissions.
     * @return True, if the application has prompted the end-user to grant the specified permissions.
     */
    private boolean hasShownRequestPermissions(String... permissions) {
        if (permissions != null) {
            for (String permission : permissions) {
                if (ActivityCompat.shouldShowRequestPermissionRationale(this, permission)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Wrapper around {@link android.support.v4.app.Fragment#requestPermissions(String[], int)} that properly handles asking the user to grant permissions to the Application.
     * Will invoke {@link android.support.v4.app.Fragment#onRequestPermissionsResult(int, String[], int[])} on completion.
     * @param requestCode The unique request code for this request
     * @param permission The permissions to request.
     * @see <a href="https://stackoverflow.com/questions/40760625/how-to-check-permission-in-fragment">How to check permissions in a Fragment</a>
     * @see <a href="https://inthecheesefactory.com/blog/things-you-need-to-know-about-android-m-permission-developer-edition/en">Things you need to know abotu Android Permissions.</a>
     * @see <a href="https://stackoverflow.com/questions/34342816/android-6-0-multiple-permissions">Requesting multiple permissions.</a>
     * @see <a href="https://stackoverflow.com/questions/41620466/android-permissions-perform-task-after-user-pressed-allow">Doing something after being granted permissions.</a>
     */
    protected void requestPermissionsWrapper (final int requestCode, final String ...permission ) {

        if (!hasPermissions(permission)) {
            if (!hasShownRequestPermissions(permission)) {

                showMessageOKCancel("You need to allow access to stuff",
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                requestPermissions(permission,requestCode);

                            }
                        });
                return;
            }

            requestPermissions(permission,requestCode);
        }
        else {

            // Permissions have already been granted. Approve of everything and manually call onRequestPermissionsResult().

            int [] granted = new int [permission.length];

            for (int grantIndex = 0 ; grantIndex < granted.length; grantIndex++)
                granted[grantIndex] = PackageManager.PERMISSION_GRANTED;

            onRequestPermissionsResult(requestCode,permission,granted);
        }

    }

    /**
     * Gets the diagonal screen size in inches.
     * @return The diagonal screen size ( in inches ).
     * @see <a href="https://inducesmile.com/android/how-to-get-android-screen-size-in-pixels-and-inches-programmatically/">Getting the screen size.</a>
     */
    protected double getScreenInches (){
        DisplayMetrics dm = new DisplayMetrics();
        this.getWindowManager().getDefaultDisplay().getMetrics(dm);
        int width = dm.widthPixels;
        int height = dm.heightPixels;
        int dens = dm.densityDpi;
        double wi = (double)width / (double)dens;
        double hi = (double)height / (double)dens;
        double x = Math.pow(wi, 2);
        double y = Math.pow(hi, 2);
        double screenInches = Math.sqrt(x+y);

        return screenInches;
    }

    /**
     * Displays a simple Alert Box.
     * @param message The message to display.
     * @param okListener Callback when user clicks "OK".
     */
    protected void showMessageOKCancel(String message, DialogInterface.OnClickListener okListener) {
        new AlertDialog.Builder(this)
                .setMessage(message)
                .setPositiveButton("OK", okListener)
                .setNegativeButton("Cancel", null)
                .create()
                .show();
    }

    /***
     * Shows a Date Picker Dialog.
     * @param initialDate The date to initialize in the Dialog.
     * @param listener The event listener to call ( when the user selects a date ).
     * @link https://www.journaldev.com/9976/android-date-time-picker-dialog
     */
    protected void showDatePickerDialog(Date initialDate, final DatePickerDialog.OnDateSetListener listener) {

        // Parse the Date so that it can be displayed in the Calndar View.
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(initialDate);
        int year = calendar.get( Calendar.YEAR);
        int month = calendar.get( Calendar.MONTH);
        int day = calendar.get( Calendar.DAY_OF_MONTH);

        DatePickerDialog datePickerDialog = new DatePickerDialog(this,
                new DatePickerDialog.OnDateSetListener() {
                    @Override
                    public void onDateSet(DatePicker view, int year,
                                          int monthOfYear, int dayOfMonth) {
                        listener.onDateSet(view,year,monthOfYear,dayOfMonth);
                    }
                }, year, month, day);
        datePickerDialog.show();
    }

    /***
     * Returns true if the Device has the capability to take pictures.
     * @return True, if the device can take pictures.
     */
    protected boolean canTakePictures () {
        final Intent captureImage = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

        return captureImage.resolveActivity( this.getPackageManager()) != null;
    }

    /***
     * Saves the specified Bitmap as a JPEG to the specified destination.
     * @param source The source Bitmap.
     * @param destination The destination File.
     * @return True, if successful.
     */
    public boolean saveBitmapAsJpeg ( Bitmap source, File destination) {

        FileOutputStream fo = null;

        try {
            ByteArrayOutputStream bytes = new ByteArrayOutputStream();
            source.compress(Bitmap.CompressFormat.JPEG, 90, bytes);
            fo = new FileOutputStream(destination);
            fo.write(bytes.toByteArray());
            MediaScannerConnection.scanFile(this,
                    new String[]{destination.getPath()},
                    new String[]{"image/jpeg"}, null);

            Log.i(LOG_TAG, "File Saved: " + destination.getAbsolutePath());
            return true;
        }
        catch (IOException e) {
            Log.e(LOG_TAG,"Problem saving photo to application. Exception: " + e.getMessage());
            return false;
        }
        finally {
            try {
                fo.close();
            }
            catch (Exception e) {
                // Throw away.
            }
        }
    }
}


