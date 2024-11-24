using Microsoft.AspNetCore.Mvc;

namespace ProductStoreSystemAPI.Controllers;

[ApiController]
[Route("api/debug")]
public class DebugController : ControllerBase
{
    private readonly IConfiguration _config;
    public DebugController(IConfiguration config) { _config = config; }

    [HttpGet("env")]
    public IActionResult GetEnvironmentVariables()
    {
        return Ok(new
        {
            AllowedOrigins = _config["AllowedOrigins"],
            JwtKey = Environment.GetEnvironmentVariable("JWT_KEY"),
            JwtIssuer = _config["Jwt:Issuer"],
            JwtAudience = _config["Jwt:Audience"]
        });
    }
}

