using ProductStoreSystemAPI.Models;
using ProductStoreSystemAPI.Repositories.Interfaces;
using ProductStoreSystemAPI.Services.Interfaces;

namespace ProductStoreSystemAPI.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _repository;

    public ProductService(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Product>> GetProductsAsync()
    {
        return await _repository.GetProductsAsync();
    }

    public async Task<Product?> GetProductByIdAsync(int id)
    {
        return await _repository.GetProductByIdAsync(id);
    }

    public async Task<Product?> AddProductAsync(ProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Desc = dto.Desc,
            Price = dto.Price
        };

        await _repository.AddProductAsync(product);
        return product;
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _repository.GetProductByIdAsync(id);
        if (product == null) return false;

        await _repository.DeleteProductAsync(product);
        return true;
    }
}