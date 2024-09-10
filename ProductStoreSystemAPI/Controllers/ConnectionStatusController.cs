using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ProductStoreSystemAPI.Hubs;

namespace ProductStoreSystemAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "1")]
public class ConnectionStatusController : ControllerBase
{
    private readonly IHubContext<CustomerConnectionHub> _hubContext;

    public ConnectionStatusController(IHubContext<CustomerConnectionHub> hubContext) { _hubContext = hubContext; }

    [HttpGet("activeConnections")]
    public IActionResult GetActiveConnections()
    {
        var activeConnections = CustomerConnectionHub.GetConnectedUsers();
        return Ok(activeConnections);
    }
}

