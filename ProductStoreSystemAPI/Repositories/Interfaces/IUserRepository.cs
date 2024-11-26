using ProductStoreSystemAPI.Models;

namespace ProductStoreSystemAPI.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User_Ps?> GetUserByEmailAsync(string email);
    Task AddUserAsync(User_Ps user);
    Task<bool> IsEmailTakenAsync(string email);
    Task<int> SaveChangesAsync();
    Task<sbyte> IsAdmin();
}
