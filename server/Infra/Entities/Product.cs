using LinqToDB.Mapping;

namespace Infra.Entities;

public class Product
{
    [PrimaryKey] public string ProductId { get; set; }
    public string ProductName { get; set; }
    public decimal ProductPrice { get; set; }
    public int Inventory { get; set; }
    public string CategoryId { get; set; }
    public string SellerId { get; set; }
    
    [Association(
        ThisKey = nameof(CategoryId), 
        OtherKey = nameof(Category.CategoryId))]
    public Category Category { get; set; }
    
    [Association(
        ThisKey = nameof(SellerId),
        OtherKey = nameof(User.UserId))]
    public User Seller { get; set; }
}