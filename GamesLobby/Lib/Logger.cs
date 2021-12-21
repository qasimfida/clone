using System;

namespace SevenCore
{
    public static class FileLog
    {
        public static string FileName = "log.txt";
        public static bool Enabled = false;
        public static void LogToFile(string data)
        {
            try
            {
                lock (FileName)
                {
                    System.IO.File.AppendAllText(FileName, data + Environment.NewLine);
                }
            }
            catch
            {
                // supress
            }
        }

        public static void LogToFile(string data, string fileName)
        {
            try
            {
                lock (fileName)
                {
                    System.IO.File.AppendAllText(fileName, data + Environment.NewLine);
                }
            }
            catch
            {
                // supress
            }
        }
    }


    public enum LogLevel
    {
        Error = 5,
        Warning = 4,
        Information = 3,
        Debug = 2,
        Trace = 1
    }

    public static class LoggerConfiguration
    {
        public static bool AnsiSupport { get; set; }
    }

    public class Logger
    {
        string _context { get; set; }
        bool _ansiSupport => LoggerConfiguration.AnsiSupport;


        public Logger(string context)
        {
            _context = context;
        }

        public void Error(params object[] args)
        {
            Log(LogLevel.Error, args);
        }

        public void Warning(params object[] args)
        {
            Log(LogLevel.Warning, args);
        }

        public void Information(params object[] args)
        {
            Log(LogLevel.Information, args);
        }

        public void Debug(params object[] args)
        {
            Log(LogLevel.Debug, args);
        }

        public void Trace(params object[] args)
        {
            Log(LogLevel.Trace, args);
        }


        void Log(LogLevel level, params object[] args)
        {

            var now = DateTime.Now.ToString("T");
            var text = now + " " + _context;
            switch (level)
            {
                case LogLevel.Warning:
                    if (_ansiSupport)
                    {
                        Console.Write("\x1b[32m");
                    }
                    else
                    {
                        Console.ForegroundColor = ConsoleColor.Yellow;
                    }
                    text += " [w] ";
                    break;
                case LogLevel.Error:
                    if (_ansiSupport)
                    {
                        Console.Write("\x1b[91m");
                    }
                    else
                    {
                        Console.ForegroundColor = ConsoleColor.Red;
                    }
                    text += " [e] ";
                    break;
                case LogLevel.Debug:
                    if (_ansiSupport)
                    {
                        Console.Write("\x1b[34m");
                    }
                    else
                    {
                        Console.ForegroundColor = ConsoleColor.Green;
                    }
                    text += " [d] ";
                    break;
                case LogLevel.Trace:
                    if (_ansiSupport)
                    {
                        Console.Write("\x1b[90m");
                    }
                    else
                    {
                        Console.ForegroundColor = ConsoleColor.White;
                    }
                    text += " [t] ";
                    break;
                default:
                    if (_ansiSupport)
                    {
                        Console.Write("\x1b[97m");
                    }
                    else
                    {
                        Console.ForegroundColor = ConsoleColor.White;
                    }
                    text += " [i] ";
                    break;
            }

            args[0] += " ";
            var rest = string.Join("\t", args);

            text += " " + rest;
            Console.WriteLine(text);
            if (_ansiSupport) Console.Write("\x1b[0m");
            if (FileLog.Enabled) FileLog.LogToFile(text);
#if DEBUG
            FileLog.LogToFile(text);
#endif
        }

    }
}