//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.SignalR;
//using ProductStoreSystemAPI.Hubs;

//namespace ProductStoreSystemAPI.Controllers;

//[Route("api/[controller]")]
//[ApiController]
//[Authorize(Roles = "1")]
//public class ConnectionStatusController : ControllerBase
//{
//    private readonly IHubContext<ConnectionHub> _hubContext;

//    public ConnectionStatusController(IHubContext<ConnectionHub> hubContext) { _hubContext = hubContext; }

//    [HttpGet]
//    public async Task<IActionResult> GetConnectionStatus()
//    {
//        await _hubContext.Clients.All.SendAsync("ReceiveConnectionStatus");
//        // Return a successful response (no need to assign the result)
//        return Ok(new { message = "Connection status sent to all clients." });
//    }

//    //[HttpPost("addAdmin")]
//    //public async Task<IActionResult> AddAdmin()
//    //{
//    //    //var connectionId = Context.ConnectionId; // Отримання ConnectionId користувача
//    //    //await _hubContext.Groups.AddToGroupAsync(connectionId, "Admins");
//    //    return Ok();
//    //}
//}

