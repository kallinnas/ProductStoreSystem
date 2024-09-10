using ProductStoreSystemAPI.Extensions;
using ProductStoreSystemAPI.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Swagger with JWT
builder.Services.AddSwaggerWithJwtAuth();
// JWT configuration
builder.Services.AddJwtAuthentication(builder.Configuration);
// SIGNAL_R
builder.Services.AddSignalR();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// MySQL Db
builder.Services.AddMySqlDatabase(builder.Configuration);

var app = builder.Build();

// Configure middleware pipeline before UseAuthorization and UseEndpoints
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// SIGNAL_R
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<CustomerConnectionHub>("/customerHub");
});

app.Run();

