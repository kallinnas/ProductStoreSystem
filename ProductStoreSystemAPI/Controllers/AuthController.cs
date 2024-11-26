using Microsoft.AspNetCore.Mvc;
using ProductStoreSystemAPI.Models;
using ProductStoreSystemAPI.Services.Interfaces;


namespace ProductStoreSystemAPI.Controllers;

public class TokenRequest { public string? Token { get; set; } }

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("validateToken")]
    public async Task<IActionResult> ValidateToken([FromBody] TokenRequest request)
    {
        bool isValid = await _authService.ValidateTokenAsync(request.Token!);
        return Ok(isValid);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserAuthDto userDto)
    {
        var token = await _authService.LoginAsync(userDto);

        if (token != null)
        {
            return Ok(new { token });
        }

        return Unauthorized();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegistrDto userDto)
    {
        var token = await _authService.RegisterAsync(userDto);
        if (token != null)
        {
            return Ok(new { token });
        }

        return BadRequest("Email is already taken.");
    }
}

