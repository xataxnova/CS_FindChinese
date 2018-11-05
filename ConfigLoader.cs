using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.IO;
using System.Text.RegularExpressions;

namespace CS_FindChinese
{
    class ConfigLoader
    {
        public static string script_path = "";
        public static string json_path = "";
        public static int init_index = 0;
        public static bool auto_replace = false;
        public static bool log_unchanged = false;
        public static string ignore_string = "";
        public static string extra_import_to_append = "";
        public static string exts = "";
        public static string ignore_files = "";
        public static string changeLangString = "";
        public static string splinters = "";

        private static bool inited = false;

        public static bool valid_extra_import
        {
            get
            {
                return string.IsNullOrEmpty(extra_import_to_append) == false;
            }
        }

        private static XmlDocument x_doc = null;
        private static XmlNode node = null;
        private static void ProcessNode(string path, System.Action action)
        {
            node = x_doc.SelectSingleNode(path);
            if (node != null)
            {
                action();
            }
            else
            {
                Console.WriteLine(" Node path wrong: " + path);
            }            
        }

        public static void InitConrfig()
        {
            if (inited) return;
            
            x_doc = new XmlDocument();
            x_doc.Load("LanguageConfig.xml");
            
            ProcessNode("/config/script_path",          () => { script_path = node.InnerText.Trim(); });
            ProcessNode("/config/json_path",            () => { json_path = node.InnerText.Trim(); });
            ProcessNode("/config/init_index",           () =>
            {
                try
                {
                    init_index = System.Convert.ToInt32(node.InnerText);
                    if (init_index < 0) init_index = 0;
                }
                catch (System.Exception ex)
                {
                    System.Console.WriteLine(ex);
                }
            });
                        
            ProcessNode("/config/auto_replace",         () => { auto_replace = node.InnerText.Contains("0") ? false : true;  });
            ProcessNode("/config/ingore_string",        () => { ignore_string = node.InnerText.Trim(); });
            ProcessNode("/config/log_unchanged",        () => { log_unchanged = node.InnerText.Contains("0") ? false : true; });
            ProcessNode("/config/extra_import",         () => { extra_import_to_append = node.InnerText.Trim(); });
            ProcessNode("/config/file_exts",            () => { exts = node.InnerText.Trim(); });
            ProcessNode("/config/ignore_files",         () => { ignore_files = node.InnerText.Trim(); });
            ProcessNode("/config/change_lang_string",   () => { changeLangString = node.InnerText.Trim(); });
            ProcessNode("/config/splinters",            () => { splinters = node.InnerText.Trim(); });
            
            inited = true;
        }
    }
}

