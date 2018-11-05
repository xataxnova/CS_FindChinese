using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS_FindChinese
{
    abstract class ExportorBase
    {
        abstract public void Export(List<ParseFileResult> file_result_list);
    }
}
