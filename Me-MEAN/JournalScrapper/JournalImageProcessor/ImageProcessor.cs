using ImageMagick;
using JournalImageProcessor.Interfaces;
using log4net;
using System;
using System.IO;

namespace JournalImageProcessor
{
    public class ImageProcessor : IImageProcessor
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(ImageProcessor));

        public string getImageFormat(string imageFilePath)
        {
            string result = null;

            if (!File.Exists(imageFilePath))
            {
                log.Error(String.Format("File does not exist. File : {0}.", imageFilePath));
            }
            else
            {
                try
                {
                    using (MagickImage image = new MagickImage(imageFilePath))
                    {
                        result = image.Format.ToString();
                    }
                }            
                catch (Exception ex)
                {
                    log.Error(String.Format("Problem getting image format for file \"{0}\". Exception : {1}.", imageFilePath, ex));
                }
            }

            return result;
        }

        public bool convertImageFormat(string imageFileInputPath, string imageFileOutputPath)
        {
            bool result = true;

            if (!File.Exists(imageFileInputPath))
            {
                log.Error(String.Format("File does not exist. File : {0}.", imageFileInputPath));
                result = false;
            }
            else
            {
                try
                {
                    using (MagickImage image = new MagickImage(imageFileInputPath))
                    {
                        image.Write(imageFileOutputPath);
                        result = true;
                    }
                }
                catch (Exception ex)
                {
                    log.Error(String.Format("Problem converting file \"{0}\". Exception : {1}.", imageFileInputPath, ex));
                    result = false;
                }
            }
            return result;
        }

        public bool addImageComment(string jpegFileInputPath, string comments)
        {
            bool result = true;

            if (!File.Exists(jpegFileInputPath))
            {
                log.Error(String.Format("File does not exist. File : {0}.", jpegFileInputPath));
                result = false;
            }
            else
            {
                try
                {
                    using (MagickImage image = new MagickImage(jpegFileInputPath))
                    {
                        ExifProfile profile = new ExifProfile();
                        profile.SetValue(ExifTag.ImageDescription, comments);
                        image.AddProfile(profile);
                        image.Write(jpegFileInputPath);                        
                    }
                }
                catch (Exception ex)
                {
                    log.Error(String.Format("Problem adding comments to file \"{0}\". Exception : {1}.", jpegFileInputPath, ex));                    
                    result = false;
                }
            }

            return result;
        }

        public string getImageComment(string jpegFileInputPath)
        {
            string result = null;

            if (!File.Exists(jpegFileInputPath))
            {
                log.Error(String.Format("File does not exist. File : {0}.", jpegFileInputPath));
            }
            else
            {
                try
                {
                    using (MagickImage image = new MagickImage(jpegFileInputPath))
                    {                                     
                        ExifProfile profile = image.GetExifProfile();

                        ExifValue value = profile.GetValue(ExifTag.ImageDescription);

                       result = value.ToString();

                    }
                }
                catch (Exception ex)
                {
                    log.Error(String.Format("Problem reading comments from file \"{0}\". Exception : {1}.", jpegFileInputPath, ex));
                }
            }

            return result;
        }
    }
}
