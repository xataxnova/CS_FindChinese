using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS_FindChinese
{
    struct ChineseStringData
    {
        public int index;
        public char splinter;
        public string ChineseString;
        public string keyString;
        public string replaceString;
    }

    //解析完一行之后的结果
    class ParseLineResult
    {
        public bool hit_Chinese = false;
        public int line_index = 0;
        public string source_string = "";
        public List<ChineseStringData> string_Chinese = new List<ChineseStringData>();
    }
}
