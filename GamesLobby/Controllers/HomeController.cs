using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace CuriousApps.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            var file = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/index.html");
            return new PhysicalFileResult(file, "text/html");
        }
    }
}
