﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ProductStoreSystemAPI.Extensions;

//public static class JwtServiceExtensions
//{
//    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
//    {
//        var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!);

//        services.AddAuthentication(options =>
//        {
//            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//        }).AddJwtBearer(options =>
//        {
//            options.Events = new JwtBearerEvents
//            {
//                OnMessageReceived = context =>
//                {
//                    var accessToken = context.Request.Query["access_token"];

//                    if (!string.IsNullOrEmpty(accessToken))
//                    {
//                        context.Token = accessToken;
//                    }
//                    return Task.CompletedTask;
//                }
//            };
//            options.TokenValidationParameters = new TokenValidationParameters
//            {
//                ValidateIssuerSigningKey = true,
//                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)),
//                ValidateIssuer = true,
//                ValidIssuer = configuration["Jwt:Issuer"],
//                ValidateAudience = true,
//                ValidAudience = configuration["Jwt:Audience"],
//                ValidateLifetime = true,
//                ClockSkew = TimeSpan.Zero // Set to zero to avoid any expiration tolerance
//            };
//        });

//        return services;
//    }
//}

public static class JwtServiceExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("Jwt");

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
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!)),
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
}
