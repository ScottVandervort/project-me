package com.scottsjewels.android.me;


import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Point;
import android.widget.ImageView;

import java.io.File;

public class PictureUtils {

    /**
     * Scales a Bitmap so that it is large as the specified Activity.
     * This makes a conservative estimate as to how big a Bitmap need to be for an Activity.
     * @param path Path to the Bitmap.
     * @param activity The Activity to scale to.
     * @return The scaled Bitmap.
     */
    public static Bitmap getScaledBitmap( String path, Activity activity) {
        Point size = new Point();
        activity.getWindowManager().getDefaultDisplay().getSize(size);

        return getScaledBitmap( path, size.x, size.y);
    }

    /**
     * Scales and returns the Bitmap at the given path.
     * @param path The path to the Bitmap.
     * @param destWidth The desired width.
     * @param destHeight The desired height.
     * @return The scaled Bitmap.
     */
    public static Bitmap getScaledBitmap(String path, int destWidth, int destHeight) {

        // Read in the dimensions of the image on disk
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(path, options);

        float srcWidth = options.outWidth;
        float srcHeight = options.outHeight;

        // Figure out how much to scale down by
        int inSampleSize = 1; // 1 = 100%, 2 = 25%

        if (srcHeight > destHeight || srcWidth > destWidth) {
            float heightScale = srcHeight / destHeight;
            float widthScale = srcWidth / destWidth;
            inSampleSize = Math.round(heightScale > widthScale ? heightScale : widthScale);
        }

        options = new BitmapFactory.Options();
        options.inSampleSize = inSampleSize;

        // Read in and create final bitmap
        return BitmapFactory.decodeFile(path, options);
    }

    /**
     * Updates an ImageView with the specified photo.
     * @param context The Activity hosting the ImageView.
     * @param photoFile The file / photo.
     * @param imageView The imageView to refresh.
     */
    public static void updateImageView(Activity context, File photoFile, ImageView imageView) {

        // Does a photo exist?
        if (photoFile == null || !photoFile.exists()) {
            imageView.setImageDrawable(null);
        }
        else {
            Bitmap bitmap = null;

            // Has the ImageView been drawn yest so that we know it's dimensions?
            if (imageView.getHeight() != 0 && imageView.getWidth() != 0) {
                // Yes. Use the dimensions of the ImageView to size the Bitmap.
                bitmap = PictureUtils.getScaledBitmap(photoFile.getPath(), imageView.getWidth(), imageView.getHeight() );
            }
            else {
                // No.
                // Since the ImageView isn't rendered until after the Photo is loaded - we cannot
                // scale the Photo appropriatelly ( we don't NEED a full-size Bitmap ). Instead,
                // scale the Bitmap down to fit the Acitivity. It will still be smaller than fullsize.
                bitmap = PictureUtils.getScaledBitmap(photoFile.getPath(), context);
            }

            imageView.setImageBitmap(bitmap);
        }
    }
}