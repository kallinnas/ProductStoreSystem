using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ProductStoreSystemAPI.Extensions;

public static class JwtServiceExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];

                    if (!string.IsNullOrEmpty(accessToken))
                    {
                        context.Token = accessToken;
                    }
                    return Task.CompletedTask;
                }
            };
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)),
                ValidateIssuer = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero // Set to zero to avoid any expiration tolerance
            };
        });

        return services;
    }
}

//public static class JwtServiceExtensions
//{
//    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
//    {
//        // Retrieve JWT settings and extract the key from configuration
//        var jwtSettings = configuration.GetSection("Jwt");
//        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

//        services.AddAuthentication(options =>
//        {
//            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//        })
//        .AddJwtBearer(options =>
//        {
//            options.TokenValidationParameters = new TokenValidationParameters
//            {
//                ValidateIssuer = true,
//                ValidIssuer = jwtSettings["Issuer"],
//                ValidateAudience = true,
//                ValidAudience = jwtSettings["Audience"],
//                ValidateIssuerSigningKey = true,
//                IssuerSigningKey = new SymmetricSecurityKey(key),
//                ValidateLifetime = true,
//                ClockSkew = TimeSpan.Zero 
//            };

//            // Include access_token support for SignalR or custom scenarios
//            options.Events = new JwtBearerEvents
//            {
//                OnMessageReceived = context =>
//                {
//                    // Check for token in query string
//                    var accessToken = context.Request.Query["access_token"];
//                    if (!string.IsNullOrEmpty(accessToken))
//                    {
//                        context.Token = accessToken;
//                    }

//                    return Task.CompletedTask;
//                }
//            };
//        });

//        return services;
//    }
//}
