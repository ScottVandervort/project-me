using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Configuration;
using System.IO;
using JournalImageProcessor;

namespace ImageProcessorTest
{
    [TestClass]
    public class ImageProcessorTest
    {
        [AssemblyInitialize]
        public static void Configure(TestContext tc)
        {
        }

        ImageProcessor imageProcessor = new ImageProcessor();

        [TestMethod]
        public void getImageFormat()
        {
            String imagesFolder = ConfigurationManager.AppSettings["imagesFolder"];

            String [] pngFiles = Directory.GetFiles(imagesFolder, "*.png");

            foreach (String pngFile in pngFiles)
            {
                Assert.IsTrue(imageProcessor.getImageFormat(pngFile).Equals("png",StringComparison.CurrentCultureIgnoreCase));
            }
        }

        [TestMethod]
        public void convertImageFormat()
        {
            String imagesFolder = ConfigurationManager.AppSettings["imagesFolder"];

            String [] pngFiles = Directory.GetFiles(imagesFolder, "*.png");

            foreach (String pngFile in pngFiles)
            {
                String newFile = Path.Combine(imagesFolder, Path.GetFileNameWithoutExtension(pngFile) + ".jpg");

                Assert.IsTrue(imageProcessor.convertImageFormat(pngFile, newFile));

                Assert.IsTrue(File.Exists(newFile));

                Assert.IsTrue(imageProcessor.getImageFormat(newFile).Equals("jpeg", StringComparison.CurrentCultureIgnoreCase));
            }            
        }

        [TestMethod]        
        public void AddImageComment()
        {
            String imagesFolder = ConfigurationManager.AppSettings["imagesFolder"];

            String[] jpegFiles = Directory.GetFiles(imagesFolder, "*.jpg");

            foreach (String jpegFile in jpegFiles)
            {
                Guid uniqueId = Guid.NewGuid();

                Console.WriteLine("Trying to write \"" + uniqueId.ToString() + "\" to \"{0}\"", jpegFile);

                Assert.IsTrue(imageProcessor.addImageComment(jpegFile, uniqueId.ToString()));

                Assert.IsTrue(imageProcessor.getImageComment(jpegFile).Equals(uniqueId.ToString(), StringComparison.CurrentCultureIgnoreCase));
            }  
        }
    }
}
