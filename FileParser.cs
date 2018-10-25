using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;

namespace CS_FindChinese
{
    class FileParser
    {
        private IgnoreLineChecker ignoreLineChecker = null;
        private string ChangeLangStr = " language[\"{0}\"] ";
        private const int C_MAX_CHAR = 512;
        private int __start_index = 0;
        private SplitPlus sp = new SplitPlus();
        private List<ParseFileResult> parse_result_list = new List<ParseFileResult>();
                
        public FileParser( string change_lang_string , int start_index = 0 )
        {
            this.ChangeLangStr = change_lang_string;
            this.__start_index = start_index;
            ignoreLineChecker = new IgnoreLineChecker();
            ignoreLineChecker.InitRemarkChecker(ConfigLoader.ignore_string);
        }

        public bool MakeSureDir(string dir)
        {
            if (Directory.Exists(dir) == false)
            {
                Directory.CreateDirectory(dir);
            }
            if (Directory.Exists(dir) == false)
            {
                Console.WriteLine("Error directory" + dir + " not found and failed to create it ");
                return false;
            }
            return true;
        }

        public void ParseAllFiles( List<FileInfo> infos )
        {
            //获得exe 所在的目录 c：/aa/
            try
            {
                foreach (FileInfo file in infos)
                {
                    ParseFile(file);
                }
            }
            catch (IOException e)
            {
                Console.WriteLine(e.Message);
            }
        }


        void ParseFile(FileInfo file)
        {
            if (file == null || string.IsNullOrEmpty(file.FullName))
            {
                return;
            }

            ParseFileResult file_result = new ParseFileResult();
            parse_result_list.Add(file_result);
            
            file_result.fileInfo = file;
            file_result.need_record_normal_file = ConfigLoader.log_unchanged;

            //-------------------去除注释干扰-------------------
            /*
             * 【1】去处注释干扰
             * 【2】生成临时文件
             * 【3】写入临时文件
             */
            string strText = CommentRemover.RemoveCommentsFormFile(file.FullName);

            string filePathtemp = file.FullName + ".temp";//这里是你的已知文件
            StreamWriter sw = File.CreateText(filePathtemp);//new StreamWriter(fs);
            sw.Write(strText);//写你的字符串。
            sw.Close();

            //------------------取出中文-------------------
            string[] lines = System.IO.File.ReadAllLines(filePathtemp);

            int linei = 0;
            foreach (string line in lines)
            {
                linei++;

                //strlist[i].ToString();

                //去掉无意义的行，注释行，等等。比如C# #region #endregion等等 
                if (ignoreLineChecker.isIgnoreLine(line.TrimEnd('\0')))
                    continue;

                ParseLineResult result = new ParseLineResult();
                result.line_index = linei;
                result.source_string = line;

                file_result.hit_chinese_count += InnerPraseLine(ref result, '\"');
                file_result.hit_chinese_count += InnerPraseLine(ref result, '\'');

                if (result.hit_Chinese == true)
                {
                    file_result.line_results.Add(result);
                    Console.WriteLine(linei + "-->" + line);
                }
            }

            //尝试记录结果到XML文件
            XMLAllFiles xml_allfile = new XMLAllFiles();
            xml_allfile.Record(this.parse_result_list);
            
            XmlLanguage xml_lang = new XmlLanguage();
            xml_lang.Record(this.parse_result_list);
            
            TextReplacer text_r = new TextReplacer(ConfigLoader.valid_extra_import, ConfigLoader.extra_import_to_append);
            text_r.ReplaceText(file.FullName, file_result);

            //删除临时文件
            File.Delete(filePathtemp);
        }


        private int InnerPraseLine(ref ParseLineResult result, char splinter)
        {
            int has_chinese = 0;

            Regex rx = new Regex("^[\u4e00-\u9fa5]$");                                          //汉字
            Regex regex = new Regex(@"[，。；？~！：‘“”’【】（）、]");                   //中文标点

            //这是为了解决C#某些编码下面会有以\0开头的字符串的BUG。
            char[] zhongwen = new char[C_MAX_CHAR];
            Array.Clear(zhongwen, 0, zhongwen.Length);

            List<string> ss = sp.SplitForQuote(result.source_string, splinter);
            Dictionary<string, string> zhongWenDic = new Dictionary<string, string>();          //暂时缓存 这一行内要替换的，等到本行扫描结束在执行替换操作
            for (int i = 0; i < ss.Count; i++)
            {
                if (i % 2 == 1)
                {
                    string str_msg = ss[i];             //双引号内容
                                                        //判断这里是否有中文
                    for (int j = 0; j < str_msg.Length; j++)
                    {
                        string aChar = str_msg[j].ToString();

                        if (rx.IsMatch(aChar) || regex.IsMatch(aChar))
                        {
                            has_chinese++;
                            zhongwen = str_msg.ToCharArray();
                            result.hit_Chinese = true;
                        }

                        if (zhongwen[0] != '\0')
                        {
                            ChineseStringData data;
                            data.ChineseString = new string(zhongwen).TrimEnd('\0');
                            data.splinter = splinter;
                            data.index = this.__start_index++;
                            data.keyString = splinter + data.ChineseString + splinter;
                            data.replaceString = string.Format(ChangeLangStr, data.index);

                            result.string_Chinese.Add(data);
                            Array.Clear(zhongwen, 0, zhongwen.Length);
                            break;
                        }
                    }
                }
            }
            return has_chinese;
        }
    }
}
