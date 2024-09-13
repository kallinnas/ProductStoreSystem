//using Microsoft.AspNetCore.Mvc;
//using Microsoft.IdentityModel.Tokens;
//using ProductStoreSystemAPI.Data;
//using ProductStoreSystemAPI.Model;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;


//namespace ProductStoreSystemAPI.Controllers;

//[Route("api/[controller]")]
//[ApiController]
//public class AuthController : ControllerBase
//{
//    private readonly AppDbContext _context;
//    private readonly IConfiguration _configuration;

//    public AuthController(AppDbContext context, IConfiguration configuration)
//    {
//        _context = context;
//        _configuration = configuration;
//    }

//    [HttpPost("login")]
//    public IActionResult Login([FromBody] UserDto userDto)
//    {
//        var user = _context.Users.SingleOrDefault(u => u.Email == userDto.Email);

//        if (user != null && BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
//        {
//            var token = GenerateJwtToken(user);
//            return Ok(new { token });
//        }

//        return Unauthorized();
//    }

//    [HttpPost("register")]
//    public IActionResult Register([FromBody] UserDto userDto)
//    {
//        bool isFirstUser = !_context.Users.Any();

//        if (_context.Users.Any(u => u.Email == userDto.Email))
//        {
//            return BadRequest("Email is already taken.");
//        }

//        var newUser = new User
//        {
//            Email = userDto.Email,
//            PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
//            Role = isFirstUser ? 1 : 0 // first user beccomes admin (Role = 1), others are customers (Role = 0)
//        };

//        _context.Users.Add(newUser);
//        _context.SaveChanges();

//        var token = GenerateJwtToken(newUser);
//        return Ok(new { token });
//    }

//    private string GenerateJwtToken(User user)
//    {
//        var jwtKey = _configuration["Jwt:Key"];

//        if (string.IsNullOrEmpty(jwtKey))
//        {
//            throw new InvalidOperationException("JWT Key is not set in the configuration.");
//        }

//        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
//        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

//        var claims = new[]
//        {
//            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
//            new Claim("role", user.Role.ToString()),
//            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
//        };

//        var token = new JwtSecurityToken(
//            issuer: _configuration["Jwt:Issuer"],
//            audience: _configuration["Jwt:Audience"],
//            claims: claims,
//            expires: DateTime.Now.AddMinutes(30),
//            signingCredentials: credentials
//        );

//        return new JwtSecurityTokenHandler().WriteToken(token);
//    }


//}


