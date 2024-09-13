using ProductStoreSystemAPI.Extensions;
using ProductStoreSystemAPI.Hubs;


var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options => options.AddPolicy("AllowAllHeaders", builder =>
{ builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod(); }));

// SIGNAL_R
builder.Services.AddSignalR(options => options.EnableDetailedErrors = true);

// MySQL Db
builder.Services.AddMySqlDatabase(builder.Configuration);

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
    endpoints.MapHub<ConnectionHub>("/ConnectionHub");
    //.RequireAuthorization();
});

app.Run();

