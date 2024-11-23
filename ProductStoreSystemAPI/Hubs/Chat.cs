using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ProductStoreSystemAPI.Models;

namespace ProductStoreSystemAPI.Hubs;

public partial class ConnectionHub: Hub
{
    public async Task GetOnlineUsers()
    {
        var userId = await GetUserId();

        var onlineUsers = await context.Connections
            .Where(c => c.UserId != userId)
            .Select(c => new UserSignalrDto(c.UserId,
                context.Users_SP.Where(p => p.Id == c.UserId)
                .Select(p => p.Name ?? "Unknown").SingleOrDefault() ?? "Unknown", c.SignalrId))
            .ToListAsync();

        await Clients.Caller.SendAsync("GetOnlineUsers_Response", onlineUsers);
    }
}
