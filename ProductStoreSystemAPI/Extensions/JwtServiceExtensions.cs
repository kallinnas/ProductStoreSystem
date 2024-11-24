using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ProductStoreSystemAPI.Services;
using System.Text;

namespace ProductStoreSystemAPI.Extensions;

public static class JwtServiceExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("Jwt");
        services.AddScoped<JwtService>();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                //IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(GetJwtKey())),
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(GetJwtKey(services))),
                //IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!)),
                ClockSkew = TimeSpan.Zero 
            };

            // Include access_token support for SignalR
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
        });

        return services;
    }

    private static string GetJwtKey(IServiceCollection services)
    {
        // Build a service provider to resolve the JwtService from DI
        using (var serviceProvider = services.BuildServiceProvider())
        {
            var jwtService = serviceProvider.GetRequiredService<JwtService>();
            return jwtService.GetJwtKey(); // Get JWT key from the JwtService instance
        }
    }
}
