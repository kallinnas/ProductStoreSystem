using ProductStoreSystemAPI.Models;

namespace ProductStoreSystemAPI.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<Product>> GetProductsAsync();
    Task<Product?> GetProductByIdAsync(int id);
    Task<Product?> AddProductAsync(ProductDto dto);
    Task<bool> DeleteProductAsync(int id);
}