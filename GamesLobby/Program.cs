using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace CuriousApps
{
    public class Program
    {
        public static string Environment;
        public static void Main(string[] args)
        {


#if !DEBUG
            // change currentdir to process dir, so appsettings.json can be found even process exec'ed from different directory
            // do this only in published code
            Directory.SetCurrentDirectory(Path.GetDirectoryName(System.Reflection.Assembly.GetEntryAssembly().Location));
            Console.WriteLine("Starting Curious Apps Lobby");
#endif


            CreateWebHostBuilder(args).Run();
        }

        public static IWebHost CreateWebHostBuilder(string[] args)
        {
            var host = WebHost.CreateDefaultBuilder(args)
                .UseKestrel()
                .UseUrls("http://*:12380")
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseStartup<Startup>().Build();
            return host;
        }
    }
}

