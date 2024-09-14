using ProductStoreSystemAPI.Models;

namespace ProductStoreSystemAPI.Repositories.Interfaces;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetProductsAsync();
    Task<Product?> GetProductByIdAsync(int id);
    Task AddProductAsync(Product product);
    Task DeleteProductAsync(Product product);
}