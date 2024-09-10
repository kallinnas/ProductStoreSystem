using Microsoft.AspNetCore.SignalR;
using MySqlX.XDevAPI;

namespace ProductStoreSystemAPI.Hubs;

public class CustomerConnectionHub : Hub
{
    private static HashSet<string> _connectedUsers = new HashSet<string>();

    public override async Task OnConnectedAsync()
    {
        _connectedUsers.Add(Context.ConnectionId);
        await Clients.All.SendAsync("CustomerConnected", Context.ConnectionId);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _connectedUsers.Remove(Context.ConnectionId);
        await Clients.All.SendAsync("CustomerDisconnected", Context.ConnectionId);
    }

    public static IEnumerable<string> GetConnectedUsers()
    {
        return _connectedUsers;
    }
}
