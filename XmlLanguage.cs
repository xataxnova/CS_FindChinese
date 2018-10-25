using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.IO;
using System.Text.RegularExpressions;

namespace CS_FindChinese
{
    /// <summary>
    /// 这个类专门用来处理lang.xml的操作。
    /// </summary>
    class XmlLanguage
    {

        private const string C_FILE_NAME = "Lang.xml";
        private XmlDocument m_doc = null;
        private XmlElement m_root = null;
        
        public XmlLanguage()
        {
            CreateXMLFile();
        }

        public void Record(List<ParseFileResult> file_result_list)
        {
            foreach (ParseFileResult file_result in file_result_list)
            {
                foreach (ParseLineResult line_res in file_result.line_results)
                {
                    foreach (ChineseStringData data in line_res.string_Chinese)
                    {
                        XmlElement Line = m_doc.CreateElement("Langs");
                        Line.SetAttribute("index", data.index.ToString());
                        Line.SetAttribute("lang", data.ChineseString.TrimEnd('\0'));
                        m_root.AppendChild(Line);
                    }
                }
            }

            m_doc.Save(C_FILE_NAME);
        }

        void CreateXMLFile()
        {
            m_doc = new XmlDocument();
            XmlDeclaration dec1 = m_doc.CreateXmlDeclaration("1.0", "utf-8", "no");
            m_doc.AppendChild(dec1);

            m_root = m_doc.CreateElement("files");
            m_doc.AppendChild(m_root);
        }

    }
}
