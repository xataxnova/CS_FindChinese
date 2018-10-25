using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.IO;
using System.Text.RegularExpressions;

namespace CS_FindChinese
{
    class XMLAllFiles
    {
        private const string C_FILE_NAME = "AllFiles.xml";
        private XmlDocument m_doc = null;
        private XmlElement m_root = null;

        public XMLAllFiles()
        {
            CreateXMLFile();
        }

        void CreateXMLFile()
        {
            m_doc = new XmlDocument();
            XmlDeclaration dec1 = m_doc.CreateXmlDeclaration("1.0", "utf-8", "no");
            m_doc.AppendChild(dec1);

            m_root = m_doc.CreateElement("files");
            m_doc.AppendChild(m_root);
        }

        public void Record( ParseFileResult file_result )
        {
            if (file_result.needRecord)
            {
                XmlElement rootFile = m_doc.CreateElement("file");
                rootFile.SetAttribute("fileName", file_result.fileInfo.FullName);

                foreach (ParseLineResult result in file_result.line_results)
                {
                    XmlElement Line = m_doc.CreateElement("LangLine");

                    Line.SetAttribute("str", result.line_index + @" 行内容--" + result.source_string.TrimEnd('\0'));
                    rootFile.AppendChild(Line);

                    foreach (ChineseStringData pair in result.string_Chinese)
                    {
                        XmlElement tfile = m_doc.CreateElement("Langs");
                        tfile.SetAttribute("lang", pair.ChineseString );
                        if (Line != null)
                        {
                            Line.AppendChild(tfile);
                        }
                    }
                }

                m_root.AppendChild(rootFile);
            }
        }

        public void Save()
        {
            m_doc.Save(C_FILE_NAME);
        }
    }
}
