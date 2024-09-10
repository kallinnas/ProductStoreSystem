using Microsoft.EntityFrameworkCore;
using ProductStoreSystemAPI.Data;

namespace ProductStoreSystemAPI.Extensions;

public static class DatabaseServiceExtensions
{
    public static IServiceCollection AddMySqlDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        string? mySqlConnectionString = configuration.GetConnectionString("MySqlConnection");

        if (string.IsNullOrEmpty(mySqlConnectionString))
        {
            throw new InvalidOperationException("The connection string 'MySqlConnection' was not found.");
        }

        services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(mySqlConnectionString, ServerVersion.AutoDetect(mySqlConnectionString)));

        return services;
    }
}
