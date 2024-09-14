using ProductStoreSystemAPI.Extensions;
using ProductStoreSystemAPI.Hubs;
using ProductStoreSystemAPI.Repositories.Interfaces;
using ProductStoreSystemAPI.Repositories;
using ProductStoreSystemAPI.Services.Interfaces;
using ProductStoreSystemAPI.Services;


var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options => options.AddPolicy("AllowAllHeaders", builder =>
{ builder.WithOrigins("http://localhost:4200").AllowCredentials().AllowAnyHeader().AllowAnyMethod(); }));

// SIGNAL_R
builder.Services.AddSignalR(options => options.EnableDetailedErrors = true);

// MySQL Db
builder.Services.AddMySqlDatabase(builder.Configuration);

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<JwtService>();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();


// JWT configuration
builder.Services.AddJwtAuthentication(builder.Configuration);

// Swagger with JWT
builder.Services.AddSwaggerWithJwtAuth();

// JsonSerializerOptions to handle object cycles
//builder.Services.AddControllers().AddJsonOptions(options =>
//{
//    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
//    options.JsonSerializerOptions.MaxDepth = 128;
//});



var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors("AllowAllHeaders");

// SIGNAL_R
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ConnectionHub>("/ConnectionHub").RequireAuthorization();
});

app.Run();

