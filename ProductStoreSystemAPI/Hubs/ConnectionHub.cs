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
        try
        {
            var userId = await GetUserId();

            var connections = await context.Connections_Ps.Where(conn => conn.UserId == userId).ToListAsync();

            context.Connections_Ps.RemoveRange(connections);
            await context.SaveChangesAsync();

            await Clients.Others.SendAsync("User_Offline", userId);

            await base.OnDisconnectedAsync(exception);
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    public async Task Authentification(UserAuthDto dto)
    {
        try
        {
            var user = await context.Users_Ps.SingleOrDefaultAsync(p => p.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                await Clients.Caller.SendAsync("Authentification_Fail", Context.ConnectionId);
            }

            else await Login(user, "Authentification_ResponseSuccess");
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    public async Task ReAuthentification(Guid userId)
    {
        try
        {
            var person = await context.Users_Ps.SingleOrDefaultAsync(u => u.Id == userId);

            if (person == null)
            {
                await Clients.Caller.SendAsync("Authentification_Fail", Context.ConnectionId);
            }

            else await Login(person, "ReAuthentification_ResponseSuccess");
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    public async Task Registration(UserRegistrDto dto)
    {
        try
        {
            if (context.Users_Ps.Any(u => u.Email == dto.Email))
            {
                await Clients.Caller.SendAsync("Registration_Fail", Context.ConnectionId);
            }

            var newUser = new User_Ps
            {
                Email = dto.Email,
                Name = dto.Name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = (sbyte)(!context.Users_Ps.Any() ? 1 : 0) // first user becomes admin (Role = 1), others are customers (Role = 0)
            };

            context.Users_Ps.Add(newUser);
            context.SaveChanges();

            await Login(newUser, "Registration_ResponseSuccess");
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    private async Task Login(User_Ps user, string successMethod)
    {
        try
        {
            var connection = await context.Connections_Ps
            .FirstOrDefaultAsync(conn => conn.UserId == user.Id)
            ?? new Connection_Ps(user.Id, Context.ConnectionId);

            if (connection.Id == default) // Check if it's a new connection
            {
                await context.Connections_Ps.AddAsync(connection);
                await context.SaveChangesAsync();
                await Clients.Others.SendAsync("User_Online", new UserSignalrDto(user.Id, user.Name, connection.SignalrId));
            }

            var userDto = new UserSignalrDto(user.Id, user.Name, connection.SignalrId);
            await Clients.Caller.SendAsync(successMethod, userDto);
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    public async Task LogoutUser(Guid userId)
    {
        try
        {
            var connection = await context.Connections_Ps.Where(c => c.UserId == userId).ToArrayAsync();
            context.Connections_Ps.RemoveRange(connection);
            await context.SaveChangesAsync();

            await Clients.Caller.SendAsync("Logout_Response");
            await Clients.Others.SendAsync("User_Offline", userId);
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    private async Task<Guid> GetUserId()
    {
        return await context.Connections_Ps.Where(c => c.SignalrId == Context.ConnectionId).Select(c => c.UserId).SingleOrDefaultAsync();
    }
}

