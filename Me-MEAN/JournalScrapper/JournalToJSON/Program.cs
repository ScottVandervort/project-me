using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Ninject;
using Ninject.Modules;
using System.Reflection;
using JournalToJSON.Models;
using Newtonsoft.Json;

namespace JournalToJSON
{
    class Program
    {
        static void Main(string[] args)
        {
            // Configure Ninject.
            IKernel _Kernal = new StandardKernel();
            _Kernal.Load(Assembly.GetExecutingAssembly());
            IParser _parser = _Kernal.Get<IParser>();

            // Configure Log4Net.
            log4net.Config.XmlConfigurator.Configure();

            if ((args.Length <= 0) || ((!File.Exists(args[0])) && (!Directory.Exists(args[0]))))
            {
                Console.WriteLine("File/Directory not specified or does not exist.");
            }
            else
            {
                List<Entry> entries;

                if (Directory.Exists(args[0]))
                    entries = _parser.parseFilesInDirectory(args[0]);
                else
                    entries = _parser.parseFile(args[0]);

                // string output = JsonConvert.SerializeObject(entries);
                // System.IO.File.WriteAllText("journal.json", output);

                StringBuilder output = new StringBuilder();

                foreach (Entry entry in entries)                
                    output.AppendLine(JsonConvert.SerializeObject(entry));

                System.IO.File.WriteAllText("journal.json", output.ToString());
            }
        }
    }
}
