using System;
using System.Collections.Generic;
using System.IO;
//###################
// c# 取出中文
// [WCX] 2014.12.19
//###################


namespace CS_FindChinese
{
    class Programme
    {
        public static void Main(string[] args)
        {
            ConfigLoader.InitConrfig();
            
            Console.WriteLine("按任意键开始解析");            
            Console.ReadKey();

            FileParser fileParser = new FileParser( ConfigLoader.changeLangString, ConfigLoader.init_index);

            string dir = System.Environment.CurrentDirectory + ConfigLoader.script_path;
            if (fileParser.MakeSureDir(dir))
            {
                FileSelector fileSelector = new FileSelector();
                List<FileInfo> infos = fileSelector.TraceFiles(new DirectoryInfo(dir), ConfigLoader.exts, ConfigLoader.ignore_files);

                List<ParseFileResult> parse_result_list = fileParser.ParseAllFiles( infos );

                //尝试记录结果到XML文件
                XMLAllFiles xml_allfile = new XMLAllFiles();
                xml_allfile.Record( parse_result_list );

                XmlLanguage xml_lang = new XmlLanguage();
                xml_lang.Record( parse_result_list );

                TSExportor_Laya tr_laya = new TSExportor_Laya();
                tr_laya.Record( parse_result_list );
            }         

            //------------------end---文件遍历部分-----------------------
            Console.WriteLine("================扫描完毕=============");

            Xml2Json.ConvertXml2Json("Lang.xml");

            Console.ReadKey();
        }
    }
}


