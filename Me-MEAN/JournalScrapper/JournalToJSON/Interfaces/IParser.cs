using System;
using System.Collections.Generic;
using JournalToJSON.Models;

namespace JournalToJSON
{
    interface IParser
    {
        List<Entry> parseFile(string file);
        List<Entry> parseFilesInDirectory(string directory);
    }
}
