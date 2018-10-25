using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace CS_FindChinese
{
    /// <summary>
    /// 去掉那些不需要检查的行
    /// 
    /// 如果以后想开发更为复杂的分析算法，这么写是很有优势的。
    /// 
    /// </summary>
    class IgnoreLineChecker
    {
        string[] RemarkFlag;

        public void InitRemarkChecker( string remark )
        {            
            Console.WriteLine("忽略标记：" + remark);
            RemarkFlag = Regex.Split(remark, ",");
        }

        public bool isIgnoreLine(string lineStr)
        {
            if (string.IsNullOrEmpty(lineStr))
                return true;

            for (int i = 0; i <= RemarkFlag.GetUpperBound(0); i++)
            {
                string Rf = RemarkFlag[i];
                int Fi1 = -1;
                Fi1 = lineStr.IndexOf(Rf);
                if (Fi1 != -1)
                    return true;
            }
            return false;
        }
    }
}
