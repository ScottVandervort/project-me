package com.scottsjewels.android.me;

import android.Manifest;
import android.app.Activity;
import android.app.DatePickerDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentManager;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.FileProvider;
import android.support.v4.graphics.BitmapCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.scottsjewels.android.me.data.DataSource;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static android.content.Context.INPUT_METHOD_SERVICE;
import static android.support.v4.content.PermissionChecker.PERMISSION_GRANTED;

public class PhotoActivity extends BaseActivity implements
        View.OnClickListener, View.OnTouchListener {

    private static final String LOG_TAG = PhotoActivity.class.getName();

    private static final int REQUEST_CODE_DATE = 0;
    private static final int REQUEST_ACCESS_TO_CAMERA = 5;
    private static final int REQUEST_PHOTO = 2;

    private static final String TAG_DATE_PICKER_FRAGMENT = "com.scottsjewels.android.me.DatePickerFragment";

    private int GALLERY = 1, CAMERA = 2;

    private static final String IMAGE_DIRECTORY = "/me_photos";
    private int mYear, mMonth, mDay, mHour, mMinute;

    private View mLayout;
    private EditText mDescriptionEditor;
    private Button mDateButton;
    private Button mPhotoButton;
    private ImageView mPhotoView;

    private File mPhotoFile;
    private Date mDate;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.fragment_photo);

        // TODO: Move to Data Store.

        // Create photo directory if it does not already exists.
        File photoDirectory = new File(this.getFilesDir().getAbsoluteFile() + "/" + IMAGE_DIRECTORY);
        if (!photoDirectory.exists())
            if (!photoDirectory.mkdirs())
                Log.e(LOG_TAG, "Photo directory does not exist and could not be created at: " + photoDirectory.getAbsolutePath());
            else
                Log.i(LOG_TAG, "Photo directory created at: " + photoDirectory.getAbsolutePath());
        else
            Log.i(LOG_TAG, "Photo directory already exists at: " + photoDirectory.getAbsolutePath());

        // List out existing files in photo directory.
        File[] existingPhotos = photoDirectory.listFiles();
        Log.i(LOG_TAG, "Photo directory size: "+ existingPhotos.length);
        for (int i = 0; i < existingPhotos.length; i++) {
            int photoSize = Integer.parseInt(String.valueOf(existingPhotos[i].length()/1024));
            Log.i(LOG_TAG, "Photo name: " + existingPhotos[i].getName() + "; Size: " + photoSize);
        }

        // Create a temporary photo file
        mPhotoFile = new File( photoDirectory, UUID.randomUUID().toString());

        // Create a temporary date.
        final Calendar c = Calendar.getInstance();
        mYear = c.get(Calendar.YEAR);
        mMonth = c.get(Calendar.MONTH);
        mDay = c.get(Calendar.DAY_OF_MONTH);
        mDate = c.getTime();

        mLayout = findViewById(R.id.layout);
        mDescriptionEditor = (EditText)findViewById(R.id.description);
        mDateButton = (Button)findViewById(R.id.select_date);
        mPhotoView = (ImageView)findViewById(R.id.photo);
        mPhotoButton = (Button)findViewById(R.id.select_photo);

        mPhotoButton.setEnabled(this.canTakePictures());

        mDateButton.setOnClickListener(this);
        mPhotoButton.setOnClickListener(this);
        mLayout.setOnTouchListener(this);
    }

    /***
     * Handles onTouch events for the Activity.
     * @param v The View that triggered the event.
     * @param event The event.
     * @return True, if the event was handled by this handler.
     */
    @Override
    public boolean onTouch(View v, MotionEvent event) {

        if ( v == mLayout) {

            /***
             * Clear focus on the description when user taps elsewhere.
             * @link https://stackoverflow.com/questions/40325325/force-edittext-to-lose-focus-when-some-keyboard-keys-are-pressed-and-when-user
             */
            InputMethodManager imm = (InputMethodManager)getSystemService(INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), 0);
            mDescriptionEditor.clearFocus();
            return false;
        }

        return false;
    }

    /***
     * Handles onClick events for the Activity.
     * @param v The View that triggered the event.
     */
    @Override
    public void onClick(View v) {

        if (v == mDateButton) {

            showDatePickerDialog(mDate, new DatePickerDialog.OnDateSetListener() {
                @Override
                public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
                    mDateButton.setText(dayOfMonth + "-" + (month + 1) + "-" + year);
                }
            });
        }
        else if (v == mPhotoButton) {
            showPictureDialog();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        boolean permissionGranted = true;

        // Have the required permssions been granted?
        for ( int granted : grantResults) {
            if (granted != PERMISSION_GRANTED) {
                permissionGranted = false;
                break;
            }
        }

        if (permissionGranted)
            switch ( requestCode ) {

                case REQUEST_ACCESS_TO_CAMERA :

                    takePhotoFromCamera();

                    break;
            }

        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_CANCELED) {
            return;
        }
        if (requestCode == GALLERY) {
            if (data != null) {

                // Get the file path ( uri ) ...
                Uri contentURI = data.getData();

                try {

                    // ... now get  the Bitmap corrsponding to the Uri ...
                    Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), contentURI);

                    Log.i(LOG_TAG,"Captured " + contentURI.getPath() + " bitmap; Size:" + BitmapCompat.getAllocationByteCount(bitmap)/1024 + " kb from gallery!");

                    // ... save the Bitmap as a JPEF to a File in the App ...
                    saveBitmapAsJpeg(bitmap, mPhotoFile);

                    // .. and update the ImageView with the new Photo.
                    PictureUtils.updateImageView(this,mPhotoFile,mPhotoView);

                    Toast.makeText(PhotoActivity.this, "Image Saved!", Toast.LENGTH_SHORT).show();
                }
                catch (IOException e) {
                    e.printStackTrace();
                    Toast.makeText(PhotoActivity.this, "Failed!", Toast.LENGTH_SHORT).show();
                }
            }

        } else if (requestCode == CAMERA) {

            // When we get a response back from the Camera Intent we need to  ...

            // ... get the file path ( uri ).
            Uri uri = FileProvider.getUriForFile(
                    this,
                    "com.scottsjewels.android.me.fileprovider",
                    mPhotoFile);

            Log.i(LOG_TAG,"Captured " + mPhotoFile.getAbsolutePath() + " bitmap; Size:" + mPhotoFile.length()/1024 + " kb from camera!");

            // The Camera has already saved the photo to the file as a Bitmap.
            // However, we need a Bitmap object ....
            Bitmap photoAsBitmap = BitmapFactory.decodeFile(mPhotoFile.getAbsolutePath());

            // ... so that we can re-write it as a JPEG ...
            this.saveBitmapAsJpeg(photoAsBitmap,mPhotoFile);

            // Lastly, we need to revoke the permissions to the uri that we granted to the Camera Intent ( so that it
            // could access our Applications files sandbox ).
            revokeUriPermission(
                    uri,
                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION);

            // .. and update the ImageView with the new Photo.
            PictureUtils.updateImageView(this,mPhotoFile,mPhotoView);

            Toast.makeText(PhotoActivity.this, "Image Saved!", Toast.LENGTH_SHORT).show();
        }
    }

    /***
     * Shows a Picture Dialog ( Gallery versus Camera ).
     * @link https://demonuts.com/pick-image-gallery-camera-android/
     */
    private void showPictureDialog(){
        AlertDialog.Builder pictureDialog = new AlertDialog.Builder(this);
        pictureDialog.setTitle("Select Action");
        String[] pictureDialogItems = {
                "Select photo from gallery",
                "Capture photo from camera" };
        pictureDialog.setItems(pictureDialogItems,
                new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        switch (which) {
                            case 0:
                                choosePhotoFromGallary();
                                break;
                            case 1:
                                requestTakePhotoFromCamera();
                                break;
                        }
                    }
                });
        pictureDialog.show();
    }

    public void choosePhotoFromGallary() {
        Intent galleryIntent = new Intent(Intent.ACTION_PICK,
                MediaStore.Images.Media.INTERNAL_CONTENT_URI);

        startActivityForResult(galleryIntent, GALLERY);
    }

    private void requestTakePhotoFromCamera() {
        requestPermissionsWrapper(REQUEST_ACCESS_TO_CAMERA, Manifest.permission.CAMERA );
    }

    private void takePhotoFromCamera() {
        // Create an Intent to capture an Image.
        final Intent captureImage = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

        // Get a location in the Application's sandbox where external applications can save files.
        // This uses the FileProvider defined in the Manifest.
        // A FileProvider grants access to another Application to write to your Application's location.
        Uri uri = FileProvider.getUriForFile(
                this,
                "com.scottsjewels.android.me.fileprovider",
                mPhotoFile);

        // Add the location as an Extra to the Intent that will be sent to the Android Camera Activity.
        captureImage.putExtra( MediaStore.EXTRA_OUTPUT, uri);

        // Find a suitable Camera Activity using the Package Manager.
        List<ResolveInfo> cameraActivities = getPackageManager().queryIntentActivities(
                captureImage,
                PackageManager.MATCH_DEFAULT_ONLY);

        // Grant access to the location for ALL of the Camera Activities.
        for (ResolveInfo activity : cameraActivities) {
            grantUriPermission(
                    activity.activityInfo.packageName,
                    uri,
                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        }

        // Now launch the Camera Activity ... and wait for a response.
        startActivityForResult(
                captureImage,
                REQUEST_PHOTO);
    }


}
