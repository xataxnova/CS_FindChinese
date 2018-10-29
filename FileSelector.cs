using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.IO;
using System.Text.RegularExpressions;

namespace CS_FindChinese
{
    //用于检索并缓存目录下指定类型的文件并记录之。
    class FileSelector
    {
        public List<FileInfo> filteredFiles = new List<FileInfo>();

        public List<FileInfo> TraceFiles( FileSystemInfo file_info, string consern_exts, string ignores = "" )
        {
            List<string> list_ext       = new List<string>( Regex.Split(consern_exts, ",") );
            List<string> ignore_files   = new List<string>( Regex.Split(ignores, ",") );

            return TraceFiles(file_info, list_ext, ignore_files);
        }

        public List<FileInfo> TraceFiles( FileSystemInfo file_info, List<string> consern_exts, List<string> ignore_files )
        {
            filteredFiles.Clear();
            innerTraceFiles(file_info, consern_exts, ignore_files);

            return filteredFiles;
        }

        void innerTraceFiles( FileSystemInfo file_info, List<string> consern_ext, List<string> ignore_files )
        {
            if (consern_ext.Count == 0)
            {
                return;
            }

            if (!file_info.Exists)
            {
                return;
            }

            //没毛病，前面是只处理文件夹，不处理文件的
            DirectoryInfo dir = file_info as DirectoryInfo;
            if (dir == null)
            {
                return;
            }

            FileSystemInfo[] files = dir.GetFileSystemInfos();

            for (int i = 0; i < files.Length; i++)
            {
                FileInfo file = files[i] as FileInfo;
                if (file != null)
                {
                    bool ignored = false;
                    foreach (string str_ignore in ignore_files)
                    {
                        if (file.Name == str_ignore)
                        {
                            ignored = true;
                            break;
                        }                        
                    }

                    if (ignored == false)
                    {
                        string path = file.FullName;
                        int index = path.LastIndexOf('.');
                        string ext = path.Substring(index + 1, path.Length - index - 1);

                        foreach (string matching_ext in consern_ext)
                        {
                            if (ext == matching_ext)
                            {
                                filteredFiles.Add(file);
                                break;
                            }
                        }
                    }
                }
                else
                {
                    DirectoryInfo sub_dir = files[i] as DirectoryInfo;
                    if (sub_dir != null)
                    {
                        innerTraceFiles(sub_dir, consern_ext, ignore_files);
                    }
                }
            }
        }
    }
}
