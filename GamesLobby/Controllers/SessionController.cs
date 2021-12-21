using Microsoft.AspNetCore.Mvc;

namespace CuriousApps.Controllers
{
    [Route("api")]
    [ApiController]

    public class SessionController : ControllerBase
    {
        [HttpGet("session")]
        public object Session()
        {
            return new
            {
                status = 1,
                result = new
                {
                    username = "test",
                    balance = 100,
                    currency = "USD"
                }
            };
        }
    }
}
