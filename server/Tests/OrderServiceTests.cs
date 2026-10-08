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
            ProductName = "Test Product",
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
        
        var updateProduct = db.Products
            .First(p => p.ProductId == "product-1");
        
        Assert.Equal(5, updateProduct.Inventory);
        Assert.Empty(db.Orders);
    }

    [Fact]
    public void CreateOrder_ProductNotFound_ThrowsValidationException()
    {
        var options = new LinqToDB.DataOptions<MyDatabaseConnection>(
            new LinqToDB.DataOptions().UseSQLite("Data Source=:memory:"));

        using var db = new MyDatabaseConnection(options);

        db.CreateTable<Product>();
        db.CreateTable<Order>();
    
        var service = new OrderService(db);

        var request = new CreateOrderRequestDto()
        {
            ProductId = "does-not-exist",
            Quantity = 1
        };

        var exception = Assert.Throws<ValidationException>(() =>
            service.CreateOrder(request, "buyer-1"));
    
        Assert.Equal("Product not found", exception.Message);
    
        Assert.Empty(db.Orders);
    }
    
    [Fact]
    public void CreateOrder_OwnProduct_ThrowsValidationException()
    {
        var options = new LinqToDB.DataOptions<MyDatabaseConnection>(
            new LinqToDB.DataOptions().UseSQLite("Data Source=:memory:"));
        
        using var db = new MyDatabaseConnection(options);

        db.CreateTable<Product>();
        db.CreateTable<Order>();

        var product = new Product
        {
            ProductId = "product-1",
            ProductName = "Test Product",
            ProductPrice = 100m,
            Inventory = 5,
            CategoryId = "category-1",
            SellerId = "user-1",
        };

        db.Insert(product);

        var service = new OrderService(db);

        var request = new CreateOrderRequestDto
        {
            ProductId = "product-1",
            Quantity = 1,
        };

        var exception = Assert.Throws<ValidationException>(() =>
            service.CreateOrder(request, "user-1"));
        
        Assert.Equal("You cannot buy your own product", exception.Message);
        
        var updateProduct = db.Products
            .First(p => p.ProductId == "product-1");
        
        Assert.Empty(db.Orders);
    }
    
    [Fact]
    public void CreateOrder_InsufficientInventory_ThrowsValidationException()
    {
        var options = new LinqToDB.DataOptions<MyDatabaseConnection>(
            new LinqToDB.DataOptions().UseSQLite("Data Source=:memory:"));
        
        using var db = new MyDatabaseConnection(options);

        db.CreateTable<Product>();
        db.CreateTable<Order>();

        var product = new Product
        {
            ProductId = "product-1",
            ProductName = "Test Product",
            ProductPrice = 100m,
            Inventory = 2,
            CategoryId = "category-1",
            SellerId = "seller-1",
        };

        db.Insert(product);

        var service = new OrderService(db);

        var request = new CreateOrderRequestDto
        {
            ProductId = "product-1",
            Quantity = 3,
        };

        var exception = Assert.Throws<ValidationException>(() =>
            service.CreateOrder(request, "user-1"));
        
        Assert.Equal("Not enough inventory", exception.Message);
        
        var updateProduct = db.Products
            .First(p => p.ProductId == "product-1");
        
        Assert.Equal(2, updateProduct.Inventory);
        
        Assert.Empty(db.Orders);
    }
    
}