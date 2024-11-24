using ProductStoreSystemAPI.Extensions;
using ProductStoreSystemAPI.Hubs;
using ProductStoreSystemAPI.Repositories.Interfaces;
using ProductStoreSystemAPI.Repositories;
using ProductStoreSystemAPI.Services.Interfaces;
using ProductStoreSystemAPI.Services;


var builder = WebApplication.CreateBuilder(args);

// RAILWAY VARIABLES
builder.Configuration.AddEnvironmentVariables();

// CORS
builder.Services.AddAppCors(builder.Configuration);

// SIGNAL_R
builder.Services.AddSignalR(options => options.EnableDetailedErrors = true);

// MySQL Db
builder.Services.AddMySqlDatabase(builder.Configuration);
builder.Services.AddScoped<JwtService>();

// JWT configuration
builder.Services.AddJwtAuthentication(builder.Configuration);

// Swagger with JWT
builder.Services.AddSwaggerWithJwtAuth();

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MigrateDatabase(); // Apply pending migrations (for railway migration db)

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseStaticFiles(); // Serve wwwroot files (Angular dist)
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors("CorsPolicy");

// SIGNAL_R
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();

    endpoints.MapHub<ConnectionHub>("/ConnectionHub").RequireAuthorization();
});

app.MapFallbackToFile("index.html"); // fallback for SPA called after app.UseEndpoints

app.Run();

