using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ProductStoreSystemAPI.Data;
using ProductStoreSystemAPI.Models;

namespace ProductStoreSystemAPI.Hubs;

public partial class ConnectionHub : Hub
{
    private readonly AppDbContext context;
    public ConnectionHub(AppDbContext context) { this.context = context; }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = await GetUserId();

        var connections = await context.Connections.Where(conn => conn.UserId == userId).ToListAsync();

        context.Connections.RemoveRange(connections);
        await context.SaveChangesAsync();

        await Clients.Others.SendAsync("User_Offline", userId);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task Authentification(UserAuthDto dto)
    {
        var user = await context.Users.SingleOrDefaultAsync(p => p.Email == dto.Email && p.Password == dto.Password);

        if (user == null)
        {
            await Clients.Caller.SendAsync("Authentification_Fail", Context.ConnectionId);
        }

        else await Login(user);
    }

    public async Task ReAuthentification(Guid userId)
    {
        var person = await context.Users.SingleOrDefaultAsync(u => u.Id == userId);

        if (person == null)
        {
            await Clients.Caller.SendAsync("Authentification_Fail", Context.ConnectionId);
        }

        else await Login(person, true);
    }

    private async Task Login(User user, bool isReAuth = false)
    {
        try
        {
            var signalrId = Context.ConnectionId;

            var existingConnection = await context.Connections.SingleOrDefaultAsync(c => c.UserId == user.Id);

            if (existingConnection == null)
            {
                var connection = new Connection(user.Id, signalrId);
                await context.Connections.AddAsync(connection);
                await context.SaveChangesAsync();
            }

            var userDto = new UserSignalrDto(user.Id, user.Name, signalrId);
            var methodName = isReAuth ? "ReAuthentification_ResponseSuccess" : "Authentification_ResponseSuccess";
            await Clients.Caller.SendAsync(methodName, userDto);
            await Clients.Others.SendAsync("User_Online", userDto);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    public async Task LogoutUser(Guid userId)
    {
        var connection = await context.Connections.Where(c => c.UserId == userId).ToArrayAsync();
        context.Connections.RemoveRange(connection);
        await context.SaveChangesAsync();

        await Clients.Caller.SendAsync("Logout_Response");
        await Clients.Others.SendAsync("User_Offline", userId);
    }

    private async Task<Guid> GetUserId()
    {
        return await context.Connections.Where(c => c.SignalrId == Context.ConnectionId).Select(c => c.UserId).SingleOrDefaultAsync();
    }
}

