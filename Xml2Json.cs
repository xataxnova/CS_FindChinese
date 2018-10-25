using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.IO;
using System.Text.RegularExpressions;

namespace CS_FindChinese
{
    class Xml2Json
    {
        static string jsonHeader = "[";
        static string jsonTail = "]";
        static string key = "\"key\"";
        static string value = "\"value\"";
        

        public static void ConvertXml2Json(string lang_xml)
        {
            XmlDocument doc = new XmlDocument();
            doc.Load(lang_xml);

            XmlElement root = null;
            root = doc.DocumentElement;

            XmlNodeList index_list = root.SelectNodes("/files/Langs");

            string path = ConfigLoader.json_path;
            string dir = ConfigLoader.json_path + "Localization.json";

            if (Directory.Exists(path) == false)
            {
                Directory.CreateDirectory(path);
            }

            StreamWriter sw = new StreamWriter( dir );
            sw.WriteLine(jsonHeader);

            List<string> cached_string = new List<string>();

            foreach (XmlNode node in index_list)
            {
                XmlAttributeCollection axts = node.Attributes;
                string index_val = axts[0].InnerText;
                string value_val = axts[1].InnerText;

                string str = "\t{\n\t\t" + key + ":\"" + index_val + "\",\n\t\t" + value + ":\"" + value_val + "\"\n\t},";
                cached_string.Add(str);
            }

            if (cached_string.Count > 0)
            {
                string last_string = cached_string[cached_string.Count - 1];
                cached_string[cached_string.Count - 1] = last_string.Remove(last_string.Length - 1, 1);

                foreach (string str in cached_string)
                {
                    sw.WriteLine(str);
                }

                sw.WriteLine(jsonTail);
            }
            sw.Close();
        }
    }
}
