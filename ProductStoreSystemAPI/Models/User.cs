namespace ProductStoreSystemAPI.Model;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public int Role { get; set; }
}

public class UserDto
{
    public string Email { get; set; }
    public string Password { get; set; }
}