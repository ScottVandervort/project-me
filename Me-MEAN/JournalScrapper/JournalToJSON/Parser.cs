using System;
using System.Collections.Generic;
using JournalToJSON.Models;
using HtmlAgilityPack;
using System.IO;
using System.Linq;
using log4net;
using System.Text;

namespace JournalToJSON
{
    class Parser : IParser
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(Parser));

        static private int extractYear(HtmlNode html)
        {
            int result = 1976;

            try
            {
                HtmlNode year = html.SelectSingleNode("h1");
                result = int.Parse( year.InnerText.Trim().Substring(year.InnerText.Trim().Length - 4, 4));
            }
            catch (Exception ex)
            {
                log.Error(String.Format("Could not parse year. Exception : {0}.", ex));
            }           

            return result;
        }

        static private Month extractMonth(HtmlNode html) 
        {
            Month result = Month.March;

            try
            {
                switch (html.InnerText.ToUpper().Trim())
                {
                    case "JANUARY": result = Month.January; break;
                    case "FEBRUARY": result = Month.February; break;
                    case "MARCH": result = Month.March; break;
                    case "APRIL": result = Month.April; break;
                    case "MAY": result = Month.May; break;
                    case "JUNE": result = Month.June; break;
                    case "JULY": result = Month.July; break;
                    case "AUGUST": result = Month.August; break;
                    case "SEPTEMBER": result = Month.September; break;
                    case "OCTOBER": result = Month.October; break;
                    case "NOVEMBER": result = Month.November; break;
                    case "DECEMBER": result = Month.December; break;
                }
            }
            catch (Exception ex)
            {
                log.Error(String.Format("Could not parse month. Exception : {0}.", ex));
            }   

            return result;
        }

        static private DateTime extractEntryDate(HtmlNode html)
        {
            DateTime result = DateTime.MinValue;

            try
            {
                String entryDate = html.InnerHtml;

                if (entryDate.IndexOf("<em>") > 0)
                {
                    entryDate = entryDate.Substring(0, entryDate.IndexOf("<em>"));
                }
                entryDate = entryDate.Trim();
                entryDate = entryDate.TrimEnd('-');
                entryDate = entryDate.Trim();
                entryDate = entryDate.Replace("st", "");
                entryDate = entryDate.Replace("Augu", "August");
                entryDate = entryDate.Replace("nd", "");
                entryDate = entryDate.Replace("rd", "");
                entryDate = entryDate.Replace("th", "");

                result = DateTime.Parse(entryDate);
            }
            catch (Exception ex)
            {
                log.Error(String.Format("Could not parse entry date. Exception : {0}.", ex));
            }

            return result;
        }

        static private String extractEntryTitle(HtmlNode html)
        {
            String result = "";

            try
            {
                HtmlNode node = html.SelectSingleNode("em");

                result = node.InnerText;
            }
            catch (Exception ex)
            {
                log.Error(String.Format("Could not parse entry title. Exception : {0}.", ex));
            }

            return result;
        }

        static private string extractEntryText( HtmlNode html ) 
        {
            StringBuilder result = new StringBuilder();

            try
            {
                HtmlNodeCollection nodeCollection = html.SelectNodes("following-sibling::p");

                if (nodeCollection != null && nodeCollection.Count > 0)
                {
                    foreach (HtmlNode node in nodeCollection)
                    {
                        if ((node.SelectNodes("img") == null) || (node.SelectNodes("img").Count <= 0))
                        {
                            String text = node.InnerHtml;
                            text = text.Replace("\r", "");
                            text = text.Replace("\n", "");
                            text = text.Replace("\t", "");
                            text = text.Trim();

                            result.Append(String.Format("<p>{0}</p>", text));

                            if (String.IsNullOrWhiteSpace(text))
                                log.Error(String.Format("Text could not be scrapped from entry. Html: {0}", html.InnerHtml));
                        }
                    }
                }
                else
                {
                    log.Error(String.Format("Could not find any text for entry. Html: {0}", html.InnerHtml));
                }
            }
            catch (Exception ex)
            {
                log.Error(String.Format("Problem parsing text. Exception : {0}.", ex));
            }
            
            return result.ToString();
        }

        static private List<Image> extractEntryImages(HtmlNode html)
        {
            List<Image> result = new List<Image>();
            HtmlNodeCollection nodeCollection;
            bool imagesFound = false;

            try
            {
                // Find images that are direct siblings of entry.
                nodeCollection = html.SelectNodes("following-sibling::img");
                if (nodeCollection != null && nodeCollection.Count > 0)
                {
                    foreach (HtmlNode entryImage in nodeCollection)
                    {
                        imagesFound = true;

                        Image image = new Image
                        {
                            Path = entryImage.GetAttributeValue("src", String.Empty),
                            Caption = entryImage.GetAttributeValue("alt", String.Empty)
                        };

                        if (String.IsNullOrEmpty(image.Path))
                            log.WarnFormat("Image has no path defined. Html : {0}", entryImage);
                        else if (String.IsNullOrEmpty(image.Caption))
                            log.WarnFormat("Image has no caption defined. Html : {0}", entryImage);
                        else
                            result.Add(image);
                    }
                }

                // Find images that are nested under a <p> of the entry.
                nodeCollection = html.SelectNodes("following-sibling::p");
                if (nodeCollection != null && nodeCollection.Count > 0)
                {
                    foreach (HtmlNode node in nodeCollection)
                    {
                        if ((node.SelectNodes("img") != null) && (node.SelectNodes("img").Count > 0))
                        {
                            foreach (HtmlNode entryImage in node.SelectNodes("img"))
                            {
                                imagesFound = true;

                                Image image = new Image
                                {
                                    Path = entryImage.GetAttributeValue("src", String.Empty),
                                    Caption = entryImage.GetAttributeValue("alt", String.Empty)
                                };

                                if (String.IsNullOrEmpty(image.Path))
                                    log.WarnFormat("Image has no path defined. Html : {0}", entryImage);
                                else if (String.IsNullOrEmpty(image.Caption))
                                    log.WarnFormat("Image has no caption defined. Html : {0}", entryImage);
                                else                              
                                    result.Add(image);                                
                            }
                        }
                    }
                }

                if (!imagesFound)
                {
                    log.Warn(String.Format("Could not find any images for entry. Html: {0}", html.InnerHtml));
                }
            }
            catch (Exception ex)
            {
                log.Error(String.Format("Problem parsing images. Exception : {0}.", ex));
            }

            return result;
        }

        public List<Entry> parseFile(string file) 
        {
           List<Entry> result = new List<Entry>();

            if (!File.Exists(file))
            {
                log.Error(String.Format("File \"{0}\" does not exist.", file));
            }
            else
            {
                log.InfoFormat("Parsing file : {0}", file);

                HtmlDocument htmlDoc = new HtmlDocument();

                htmlDoc.Load(file);

                if (htmlDoc.DocumentNode != null)
                {
                    HtmlAgilityPack.HtmlNode bodyNode = htmlDoc.DocumentNode.SelectSingleNode("//body");

                    foreach (HtmlParseError error in htmlDoc.ParseErrors)
                    {
                        log.Error(String.Format("Error \nCode: {0}\nLine: {1}\nPosition : {2}\nReason : {3}\nSource Text : {4} ", error.Code, error.Line, error.LinePosition, error.Reason, error.SourceText));
                    }

                    if (htmlDoc.ParseErrors.Count() == 0)
                    {
                        if (bodyNode != null)
                        {
                            int year = extractYear(bodyNode);

                            HtmlNodeCollection monthsNodeCollection = bodyNode.SelectNodes("//h3");

                            foreach (HtmlNode monthNode in monthsNodeCollection)
                            {
                                Month month = extractMonth(monthNode);

                                HtmlNodeCollection entryNodeCollection = monthNode.SelectNodes("following-sibling::div[1]/ul/li/h2");

                                // If entries exist for the month, resume ...
                                if (entryNodeCollection != null)
                                {
                                    foreach (HtmlNode entryNode in entryNodeCollection)
                                    {
                                        DateTime entryDate = extractEntryDate(entryNode);
                                        String entryTitle = extractEntryTitle(entryNode);

                                        DateStamp entryKey = new DateStamp()
                                        {
                                            Year = year,
                                            Month = month,
                                            Day = entryDate.Day
                                        };

                                        String entryText = extractEntryText(entryNode);

                                        List<Image> entryImages = extractEntryImages(entryNode);

                                        result.Add(
                                            new Entry()
                                            {
                                                Key = entryKey,
                                                Title = entryTitle,
                                                Text = entryText,
                                                Images = entryImages
                                            });
                                    }
                                }
                                else
                                {
                                    log.Error(String.Format("Could not find any entries for month. Html: {0}", monthNode.InnerHtml));
                                }
                            }
                        }
                    }
                }
            }

            return result;
        }

        public List<Entry> parseFilesInDirectory(string directory)
        {
            List<Entry> result = new List<Entry>();

            if (!Directory.Exists(directory))
            {
                log.Error(String.Format("Directory \"{0}\" does not exist.", directory));
            }
            else
            {
                log.InfoFormat("Parsing directory : {0}", directory);

                foreach (String file in Directory.GetFiles(directory))
                {                    
                    result.AddRange(parseFile(file));
                }
            }

            return result;
        }
    }
}