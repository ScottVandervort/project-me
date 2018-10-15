using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JournalImageProcessor.Interfaces
{
    public interface IImageProcessor
    {
        /// <summary>
        /// Converts an image type. The type is determined by the file extension.
        /// </summary>
        /// <param name="imageFileInputPath">The input image.</param>
        /// <param name="imageFileOutputPath">The output image.</param>
        /// <returns>True, if successful.</returns>
        bool convertImageFormat(string imageFileInputPath, string imageFileOutputPath);
        
        /// <summary>
        /// Gets the image format (.jpeg, .png, etc...)
        /// </summary>
        /// <param name="imageFilePath">The image file path.</param>
        /// <returns>The image format.</returns>
        string getImageFormat(string imageFilePath);

        /// <summary>
        /// Add comments to .jpeg image.
        /// </summary>
        /// <param name="jpegFileInputPath">The path to the .jpeg image to add a comment to.</param>
        /// <param name="comments">The comment to add to the .jpeg metadata.</param>
        /// <returns>True, if successful.</returns>
        bool addImageComment(string jpegFileInputPath, string comments);

        /// <summary>
        /// Gets comment from .jpeg image.
        /// </summary>
        /// <param name="jpegFileInputPath">The path to the .jpeg image to get comment from.</param>
        /// <returns>The comment.</returns>
        string getImageComment(string jpegFileInputPath);
    }
}
