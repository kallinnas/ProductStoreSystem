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
builder.Services.AddSwaggerGen();

// Swagger with JWT
//builder.Services.AddSwaggerWithJwtAuth();

// JWT configuration
//builder.Services.AddJwtAuthentication(builder.Configuration);



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

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors("AllowAllHeaders");

//app.UseHttpsRedirection();

// SIGNAL_R
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ConnectionHub>("/ConnectionHub");
    //endpoints.MapHub<ConnectionHub>("/connectionHub").RequireAuthorization();
});

app.Run();

