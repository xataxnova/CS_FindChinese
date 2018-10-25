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

                fileParser.ParseAllFiles( infos );
            }         

            //------------------end---文件遍历部分-----------------------
            Console.WriteLine("================扫描完毕=============");

            Xml2Json.ConvertXml2Json("Lang.xml");

            Console.ReadKey();
        }
    }
}


