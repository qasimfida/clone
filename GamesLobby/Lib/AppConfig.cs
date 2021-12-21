using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.IO;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.EnvironmentVariables;
using Microsoft.Extensions.FileProviders;

namespace SevenCore
{
    public static class AppConfig
    {

        static Logger log = new Logger("AppConfig");
        public static IConfigurationRoot Configuration { get; set; }

        public static string Env { get; set; }
        static ConcurrentDictionary<string, string> configCache = new ConcurrentDictionary<string, string>();
        const string envPrefix = "DOTNET_APPSETTING_";
        static string procName;
        const string appPrefix = "App:";
        static string procKeyPrefix = string.Empty;

        static string getProviderSource(IConfigurationProvider provider)
        {
            if (provider is FileConfigurationProvider)
            {
                var fileConfig = provider as FileConfigurationProvider;
                var fileProvider = fileConfig?.Source.FileProvider as PhysicalFileProvider;
                return "from file:" + Path.Combine(fileProvider?.Root ?? "", fileConfig?.Source.Path ?? "");
            }
            else if (provider is EnvironmentVariablesConfigurationProvider)
            {
                return "from env";
            }
            else
            {
                return "from un-handled provider";
            }
        }
        static AppConfig()
        {

            try
            {
                var builder = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory());
                // check if setting files are overridden by environment variable
                var settingFiles = Environment.GetEnvironmentVariable("XTRA_APPSETTINGS");
                if (string.IsNullOrEmpty(settingFiles))
                {
                    // set default set of files.
                    settingFiles = "appsettings.json,appsettings.local.json";
                }
                var entryAsm = Assembly.GetEntryAssembly();
                procName = entryAsm?.GetName().Name ?? string.Empty;
                if (!string.IsNullOrEmpty(procName))
                {
                    procKeyPrefix = $"{appPrefix}{procName}:";
                }
#if DEBUG
                // add user setting file at the end of the list in debug mode
                if (!string.IsNullOrEmpty(procName))
                {
                    string homeDir = Environment.GetEnvironmentVariable("HOME") ?? Environment.GetEnvironmentVariable("USERPROFILE");
                    string userCommonSetting = Path.Combine(homeDir, "appsettings", "common.json");
                    string userAppSetting = Path.Combine(homeDir, "appsettings", $"{procName}.json");
                    settingFiles += $",{userCommonSetting},{userAppSetting}";
                }
#endif
                var fileList = settingFiles.Split(',', StringSplitOptions.RemoveEmptyEntries);
                bool optional = false;
                foreach (var file in fileList)
                {
                    builder.AddJsonFile(file, optional: optional);
                    optional = true;
                }
                builder.AddEnvironmentVariables(envPrefix);
                Configuration = builder.Build();

                log.Information($"current directory:'{Directory.GetCurrentDirectory()}'");
                log.Information($"current configuration (procKeyPrefix='{procKeyPrefix}'):");
                log.Information($"using env vars prefixed with: {envPrefix}");
                log.Information($"using files: {settingFiles}");
                var reverseProviders = new List<IConfigurationProvider>(Configuration.Providers);
                reverseProviders.Reverse();
                foreach (var kv in Configuration.AsEnumerable())
                {
                    if (string.IsNullOrEmpty(kv.Value))
                    {
                        continue;
                    }
                    if (kv.Key.StartsWith(appPrefix)
                        && !kv.Key.StartsWith(procKeyPrefix))
                    {
                        continue;
                    }
                    string msg = string.Empty;
                    foreach (var provider in reverseProviders)
                    {
                        string value;
                        foreach (string key in new[] { $"{procKeyPrefix}{kv.Key}", kv.Key })
                        {
                            //log.Information($"key='{key}'");
                            if (provider.TryGet(key, out value))
                            {
                                // pre-cache the value, always use 'kv.Key' so App:XXX:Key can override it.
                                configCache.TryAdd(kv.Key, value);
                                //log.Information($"  found value '{value}' for key '{key}'");
                                msg = $"    {key} -> {value} ({getProviderSource(provider)}";
                                break;
                            }
                            if (!string.IsNullOrEmpty(msg))
                            {
                                break;
                            }
                        }
                    }
                    log.Information(msg);
                    Env = Read("Env");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        static ConcurrentDictionary<string, IConfigurationSection> configSectionCache = new ConcurrentDictionary<string, IConfigurationSection>();
        public static string Read(string target)
        {
            // config reads are expensive if there are multiple providers
            // so cache the value in a simple hash table.
            return configCache.GetOrAdd(target,
                (key) => Configuration[$"{procKeyPrefix}{key}"] ?? Configuration[key]);
        }

        public static IConfigurationSection GetSection(string key)
        {
            var result = Configuration.GetSection($"{procKeyPrefix}{key}");
            return result.Exists()
                ? result
                : Configuration.GetSection(key);

        }
        public static List<T> Read<T>(string target)
        {
            try
            {
                return configSectionCache.GetOrAdd(target,
                    (key) => GetSection(key)
                ).Get<List<T>>();
            }
            catch
            {
                return default(List<T>);
            }
        }

        public static List<string> Get(string target)
        {
            var found = false;
            var result = new List<string>();
            foreach (var kv in Configuration.AsEnumerable())
            {
                var key = kv.Key;
                var v = kv.Value;

                if (key == target)
                {
                    found = true;
                    Console.WriteLine(key);
                }
                else
                {
                    if (found)
                    {
                        if (key.IndexOf(target) < 0)
                        {
                            break;
                        }
                        else
                        {
                            var subKey = key.Split(target + ":")[1];
                            if (subKey.IndexOf(":") >= 0)
                            {
                                // sub data
                            }
                            else
                            {
                                result.Add(subKey);
                            }
                        }
                    }
                }
            }

            return result;
        }
    }
}
