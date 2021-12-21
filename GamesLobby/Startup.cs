using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.SpaServices.Webpack;
using ProxyKit;
using SevenCore;

namespace CuriousApps
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<KestrelServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddProxy();
            services.AddHttpContextAccessor();

            services.AddRazorPages()
                .AddNewtonsoftJson();

        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            ConfigureProxies(app, env);

            // put client-side routes here to rewrite them to / so index.html can be loaded.
            app.UseRewriter(new RewriteOptions()
                .AddRewrite(@"__webpack_hmr", "__webpack_hmr", skipRemainingRules: true)
                .AddRewrite(@"^.*(hot-update.json$)(.*)$", "/$1", skipRemainingRules: true)
                .AddRewrite(@"js/(.*)", "/js/$1", skipRemainingRules: true)
                .AddRewrite(@"img/(.*)", "/img/$1", skipRemainingRules: true)
                .AddRewrite(@"api/(.*)", "/api/$1", skipRemainingRules: true)
                .AddRewrite(@"lib/(.*)", "/content/lib/$1", skipRemainingRules: true)
                .AddRewrite(@"content/(.*)", "/content/$1", skipRemainingRules: true)
                .AddRewrite(@"css/(.*)", "/css/$1", skipRemainingRules: true)
                .AddRewrite("^.*|$", "/", skipRemainingRules: true)
            );



            if (env.IsDevelopment())
            {
                // UseWebpackDev stuff been made obsolete in dotnet core 3.1
                // needs to be migrated, disable obsolete warning for time being.
#pragma warning disable CS0618
                try
                {
                    app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                    {
                        ProjectPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp"),
                        EnvParam = new
                        {
                            env = "dev",
                            Skin = AppConfig.Read("Skin").ToString()
                        },
                        HotModuleReplacement = true,
                        ReactHotModuleReplacement = true
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
#pragma warning restore CS0618
                app.UseExceptionHandler("/");
            }
            else
            {
                app.UseExceptionHandler("/");
            }


            // app.UseHttpsRedirection();
            app.UseDefaultFiles();


            var webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            if (env.IsDevelopment())
            {
                Directory.CreateDirectory(webRoot);
            }

            env.WebRootPath = webRoot;

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(webRoot),
            });

            app.UseCookiePolicy();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(routes =>
            {
                routes.MapRazorPages();
                routes.MapControllerRoute(
                    name: "default",
                    pattern: "",
                    defaults: new { Controller = "Home", Action = "Index" }
                );
            });
        }


        private void silenceWebSocketProxyExceptions(IApplicationBuilder proxyApp)
        {
            // silence proxy exceptions about connection abort/cancel/etc..
            proxyApp.Use(async (context, next) =>
            {
                try
                {
                    await next();
                }
                catch (System.Net.WebSockets.WebSocketException ws)
                {
                    Console.WriteLine("Websocket exception", ws.Message);
                }
                catch (OperationCanceledException oex)
                {
                    Console.WriteLine("Operation Canceled exception", oex.Message);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("General error", ex.Message);
                }
            });
        }

        void ConfigureProxies(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseWebSockets();
            var frontendSocketUrl = AppConfig.Read($"Socket:{(AppConfig.Read("Env"))}");
            app.Map("/_frontendSocket", frontendSocketApp =>
            {
                Console.WriteLine($"proxying websocket '/_socket' to '{frontendSocketUrl}'");
                silenceWebSocketProxyExceptions(frontendSocketApp);
                frontendSocketApp.UseWebSocketProxy(
                    context => new Uri(frontendSocketUrl),
                    options => options.AddXForwardedHeaders()
                );
            });
        }
    }
}
