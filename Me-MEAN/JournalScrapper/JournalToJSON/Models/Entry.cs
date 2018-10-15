using System;
using System.Collections.Generic;
using System.Text;

namespace JournalToJSON.Models
{
    public class Entry
    {
        public DateStamp Key;
        public String Title { get; set; }
        public String Text { get; set; }
        public List<Image> Images { get; set; }

        public override string ToString()
        {
            StringBuilder images = new StringBuilder();

            foreach (Image image in Images)
                images.AppendFormat("Path : {3}, Caption : {4}\n",
                    image.Path,
                    image.Caption);

            return String.Format("{0}\nTitle : {1}\nText : {2}\nImages : {3}", 
                String.Format("{0}\\{1}\\{2}",(int)Key.Month, Key.Day, Key.Year), 
                Title, 
                Text, 
                images.ToString());
        }
    }
}
