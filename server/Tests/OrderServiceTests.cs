using System.ComponentModel.DataAnnotations;
using Infra;
using Infra.Entities;
using LinqToDB;
using Service;
using Service.RequestDtos;

namespace Tests;

public class OrderServiceTests
{
    [Fact]
    public void CreateOrder_ValidatePurchase_CreatesOrderAndDecreaseInventory()
    {
        var options = new LinqToDB.DataOptions<MyDatabaseConnection>(
            new LinqToDB.DataOptions().UseSQLite("Data Source=:memory:"));
        
        using var db = new MyDatabaseConnection(options);

        db.CreateTable<Product>();
        db.CreateTable<Order>();

        var product = new Product
        {
            ProductId = "product-1",
            ProductName = "Text Product",
            ProductPrice = 100m,
            Inventory = 5,
            CategoryId = "category-1",
            SellerId = "seller-1",
        };

        db.Insert(product);

        var service = new OrderService(db);

        var request = new CreateOrderRequestDto
        {
            ProductId = "product-1",
            Quantity = 2,
        };

        var order = service.CreateOrder(
            request,
            "buyer-1");
        
        Assert.NotNull(order);
        Assert.Equal("product-1", order.ProductId);
        Assert.Equal("buyer-1", order.BuyerId);
        Assert.Equal("seller-1", order.SellerId);
        Assert.Equal(2, order.Quantity);
        Assert.Equal(100m, order.ProductPrice);
        
        var updatedProduct = db.Products
            .First(p => p.ProductId == "product-1");
        
        Assert.Equal(3, updatedProduct.Inventory);
        
        var savedOrder = db.Orders
            .First(o => o.OrderId == order.OrderId);

        Assert.Equal(2, savedOrder.Quantity);
        
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void CreateOrder_ZeroQuantity_ThrowsValidationException(int quantity)
    {
        var options = new LinqToDB.DataOptions<MyDatabaseConnection>(
            new LinqToDB.DataOptions().UseSQLite("Data Source=:memory:"));

        using var db = new MyDatabaseConnection(options);

        db.CreateTable<Product>();
        db.CreateTable<Order>();

        var product = new Product
        {
            ProductId = "product-1",
            ProductName = "Text Product",
            ProductPrice = 100m,
            Inventory = 5,
            CategoryId = "category-1",
            SellerId = "seller-1",
        };

        db.Insert(product);

        var service = new OrderService(db);

        var request = new CreateOrderRequestDto
        {
            ProductId = "product-1",
            Quantity = quantity,
        };
        
        var exception = Assert.Throws<ValidationException>(() => 
            service.CreateOrder(request, "buyer-1"));
        
        Assert.Equal("Quantity must be greater than 0",
            exception.Message);
        
        }
}