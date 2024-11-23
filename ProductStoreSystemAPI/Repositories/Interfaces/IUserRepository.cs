using ProductStoreSystemAPI.Models;

namespace ProductStoreSystemAPI.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User_SP?> GetUserByEmailAsync(string email);
    Task AddUserAsync(User_SP user);
    Task<bool> IsEmailTakenAsync(string email);
    Task<int> SaveChangesAsync();
    Task<sbyte> IsAdmin();
}
