using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace CS_FindChinese
{
    class TSExportor_CocosCreator:ExportorBase
    {
        private string file_name = "Localization.ts";
        private string header_string = "export class Localization {\n";
        private string tail_string = "}\nexport let localization:Localization = new Localization()";
        private string template_string = "\tstring_{0}:string = \"{1}\";\n";

        public static string extra_path = "FindChineseResult/";

        override public void Export(List<ParseFileResult> file_result_list)
        {
            string result = "";
            result += header_string;
            foreach (ParseFileResult file_result in file_result_list)
            {
                foreach (ParseLineResult line_result in file_result.line_results)
                {
                    foreach (ChineseStringData csd in line_result.string_Chinese)
                    {
                        string temp = string.Format(template_string, csd.index.ToString(), csd.ChineseString);
                        result += temp;
                    }
                }
            }
            result += tail_string;
            StreamWriter sr = File.CreateText(extra_path + file_name);
            sr.Write(result);
            sr.Close();
        }
    }
}
