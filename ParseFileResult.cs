using System;
using System.Collections.Generic;
using System.IO;


namespace CS_FindChinese
{
    class ParseFileResult
    {
        public int hit_chinese_count = 0;
        public bool need_record_normal_file = false;
        public FileInfo fileInfo = null;
        public List<ParseLineResult> line_results = new List<ParseLineResult>();

        public bool needRecord
        {
            get
            {
                return hit_chinese_count > 0 || (hit_chinese_count == 0 && need_record_normal_file);
            }
        }
    }
}
