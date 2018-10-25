using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace CS_FindChinese
{
    class TextReplacer
    {
        bool use_header = false;
        string header_content = "";

        public TextReplacer(bool in_use_header, string in_header_content)
        {
            this.use_header = in_use_header;
            this.header_content = in_header_content;
        }

        public void ReplaceText(string origin_file_path, ParseFileResult file_result)
        {
            if (file_result.needRecord == false)
                return;
            
            if (string.IsNullOrEmpty(origin_file_path) || !File.Exists(origin_file_path) )
                return;
            
            string[] sql = System.IO.File.ReadAllLines(origin_file_path);


            foreach (ParseLineResult plr in file_result.line_results)
            {
                int rows = -1;//行号
                for (int i = 0; i < sql.Length; i++)
                {           
                    if (string.Equals(sql[i], plr.source_string))
                    {
                        rows = i;
                        break;
                    }
                }

                if (rows < 0)
                {
                    continue;
                }

                foreach (ChineseStringData csd in plr.string_Chinese)
                {
                    sql[rows] = sql[rows].Replace(csd.keyString, csd.replaceString);
                }
            }

            if (sql[0].Contains(this.header_content) == false && this.use_header )
            {
                List<string> all_line = new List<string>();
                all_line.Add(this.header_content);
                all_line.AddRange(sql);
                System.IO.File.WriteAllLines(origin_file_path, all_line.ToArray());
            }
            else
            {
                System.IO.File.WriteAllLines(origin_file_path, sql);
            }
        }
    }
}
