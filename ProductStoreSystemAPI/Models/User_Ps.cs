﻿namespace ProductStoreSystemAPI.Models;

public class User_Ps
{
    public Guid Id { get; set; }
    public sbyte Role { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public virtual ICollection<Connection_Ps> Connections { get; set; } = new List<Connection_Ps>();
}

public class UserAuthDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class UserRegistrDto : UserAuthDto
{
    public string Name { get; set; } = null!;
}

public class UserSignalrDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string SignalrId { get; set; }
    public UserSignalrDto(Guid id, string name, string signalrId)
    {
        Id = id; Name = name; SignalrId = signalrId;
    }
}