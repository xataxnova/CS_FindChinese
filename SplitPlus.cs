using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS_FindChinese
{
    class SplitPlus
    {
        public List<string> SplitForQuote( string source, char splinter )
        {
            List<string> result = new List<string>();

            int last_match = 0;
            
            for (int index = 0; index < source.Length; index++)
            {
                if (source[index] == splinter)
                {
                    if (index == 0)
                    {
                        result.Add("");//确保奇数项目一定是引号内的有效内容。
                        last_match = index + 1;
                    }
                    else if (source[index - 1] == '\\')
                    {
                        continue;
                    }
                    else
                    {
                        result.Add(source.Substring(last_match, index - last_match));
                        last_match = index + 1;
                    }
                }
            }
            
            //this will not happend normally
            return result;
        }
    }
}
