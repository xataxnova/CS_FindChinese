using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Text.RegularExpressions;

namespace CS_FindChinese
{

    /// <summary>
    /// 这个类用于去除文件中的注释行。注释中的中文是不需要处理的。
    /// </summary>
    class CommentRemover
    {
        public static string RemoveCommentsFormFile(string path)
        {
            StreamReader Fs = new StreamReader(path);
            string Text = Fs.ReadToEnd();
            Fs.Close();
            return RemoveComments(Text);
        }

        public static string RemoveComments(string Text)
        {
            string strRemark = "";

            if (strRemark == "")
                strRemark = "///,//,/*..*/";
            string[] RemarkFlag = Regex.Split(strRemark, ",");
            for (int i = 0; i <= RemarkFlag.GetUpperBound(0); i++)
            {
                string Rf = RemarkFlag[i];
                if (Rf.IndexOf("..") != -1)
                {
                    string Flag1 = Rf.Substring(0, Rf.IndexOf(".."));
                    string Flag2 = Rf.Substring(Rf.IndexOf("..") + 2, Rf.Length - Rf.IndexOf("..") - 2);
                    Text = ChangeWithDoubleFlag(Text, Flag1, Flag2);
                }
                else
                {
                    Text = ChangeWithSingleFlag(Text, Rf);
                }
            }

            return Text;
        }

        static string ChangeWithDoubleFlag(string MainText, string FlagStart, string FlagEnd)
        {
            string str = MainText;
            string chgValue;
            string returnValue;
            int Fi1 = -1;//First Flag Index;
            int Fi2 = -1;//Second Flag Index;
            Fi1 = str.IndexOf(FlagStart);
            if (Fi1 != -1)
                Fi2 = str.IndexOf(FlagEnd, Fi1);
            if (Fi1 != -1 && Fi2 != -1)
            {
                chgValue = str.Remove(Fi1, Fi2 - Fi1 + FlagEnd.Length);
                returnValue = ChangeWithDoubleFlag(chgValue, FlagStart, FlagEnd);
            }
            else
            {
                returnValue = MainText;
            }
            return returnValue;
        }

        static string ChangeWithSingleFlag(string MainText, string Flag)
        {
            string str = MainText;
            string chgValue;
            int Fi1 = -1;//First Flag Index;
            int Fi2 = -1;//Second Flag Index;
            string returnValue = "";
            Fi1 = str.IndexOf(Flag);

            if (Fi1 != -1)
                Fi2 = str.IndexOf("\n", Fi1);

            if (Fi1 != -1 && Fi2 != -1)
            {
                chgValue = str.Remove(Fi1, Fi2 - Fi1);//+2);
                returnValue = ChangeWithSingleFlag(chgValue, Flag);
            }
            else
                returnValue = MainText;

            return returnValue;
        }
    }
}
