namespace ProductStoreSystemAPI.Models;

public class Product
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Desc { get; set; } = null!;
    public decimal Price { get; set; }
    public string? Image { get; set; }
}

public class ProductDto
{
    public string Name { get; set; } = null!;
    public string Desc { get; set; } = null!;
    public decimal Price { get; set; }

}