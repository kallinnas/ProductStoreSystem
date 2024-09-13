namespace ProductStoreSystemAPI.Models;

public partial class Product
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Desc { get; set; } = null!;
    public decimal Price { get; set; }
    public string? Image { get; set; }
}
