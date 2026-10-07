using LinqToDB.Mapping;

namespace Infra.Entities;

public class Order
{
    [PrimaryKey] public string OrderId { get; set; }

    public string BuyerId { get; set; }
    public string ProductId { get; set; }
    public string SellerId { get; set; }
    
    public int Quantity { get; set; }
    public decimal ProductPrice { get; set; }
    public DateTime OrderDate { get; set; }
    
    [Association(
        ThisKey = nameof(BuyerId),
        OtherKey = nameof(User.UserId))]
    public User Buyer { get; set; }
    
    [Association(
        ThisKey = nameof(ProductId),
        OtherKey = nameof(Product.ProductId))]
    public Product Product { get; set; }
    
    [Association(
        ThisKey = nameof(SellerId),
        OtherKey = nameof(User.UserId))]
    public User Seller { get; set; }
    
}