namespace ProductStoreSystemAPI.Models;

public class Connection_Ps
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string SignalrId { get; set; } = null!;
    public DateTime? TimeStamp { get; set; }
    public virtual User_Ps User { get; set; } = null!;
    public Connection_Ps(Guid userId, string signalrId)
    {
        UserId = userId;
        SignalrId = signalrId;
        TimeStamp = DateTime.UtcNow;
    }
}
