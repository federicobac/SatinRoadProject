using System.ComponentModel.DataAnnotations;
using Infra;
using Infra.Entities;
using LinqToDB;
using Service.RequestDtos;

namespace Service;

public class OrderService(MyDatabaseConnection db)
{
    public Order CreateOrder(
        CreateOrderRequestDto dto,
        string buyerId)
    {
        if (dto.Quantity <= 0)
            throw new ValidationException("Quantity must be greater than 0");
        
        var product = db.Products
            .FirstOrDefault(p => p.ProductId == dto.ProductId);

        if (product is null)
            throw new ValidationException("Product not found");

        if (dto.Quantity > product.Inventory)
            throw new ValidationException("Not enough inventory");
        
        using var transaction = db.BeginTransaction();
        
        product.Inventory -= dto.Quantity;

        db.Update(product);

        var order = new Order
        {
            OrderId = Guid.NewGuid().ToString(),
            BuyerId = buyerId,
            ProductId = product.ProductId,
            SellerId = product.SellerId,
            Quantity = dto.Quantity,
            ProductPrice = product.ProductPrice,
            OrderDate = DateTime.UtcNow,
        };
        
        db.Insert(order);
        
        transaction.Commit();
        
        return order;
    }

    public List<OrderDto> GetMyOrders(string buyerId)
    {
        return db.Orders
            .Where(o => o.BuyerId == buyerId)
            .LoadWith(o => o.Product)
            .LoadWith(o => o.Seller)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new OrderDto(o)
            {
                ProductName = o.Product.ProductName,
                SellerUsername = o.Seller.Username
            })
            .ToList();
    }
}