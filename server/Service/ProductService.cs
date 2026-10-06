using System.ComponentModel.DataAnnotations;
using Infra;
using Infra.Entities;
using LinqToDB;
using Service.RequestDtos;

namespace Service;


public class ProductService(MyDatabaseConnection db)
{
    public List<ProductDto> GetProducts(int page, int resultsPerPage)
    {
        if (page < 1)
            throw new ValidationException("Page must be 1 or higher");
        if (resultsPerPage < 1)
            throw new ValidationException("Must have at least 1 results per page");
        
        return db.Products
            .LoadWith(p => p.Category)
            .ThenLoad(c => c.ProductsByCategory)
            .Take(resultsPerPage)
            .Skip((page - 1) * resultsPerPage)
            .Select(p => new ProductDto(p)
            {
                Category = new CategoryDto(p.Category),
            })
            .ToList();
    }

    public ProductDto CreateProduct(
        CreateProductRequestDto productRequestDto,
        string sellerId)
    {
        if (productRequestDto.ProductPrice < 0)
            throw new ValidationException("Price must be greater than 0");
        
        if (productRequestDto.Inventory < 0)
            throw new ValidationException("Inventory must be greater than 0");
        
        if (!db.Categories.Any(c => c.CategoryId == productRequestDto.CategoryId)) 
            throw new ValidationException("Category does not exists");
        
        var p = new Product()
        {
            ProductId = Guid.NewGuid().ToString(),
            ProductName = productRequestDto.ProductName,
            ProductPrice = productRequestDto.ProductPrice,
            Inventory = productRequestDto.Inventory,
            CategoryId = productRequestDto.CategoryId,
            SellerId = sellerId
        };
        db.Insert(p);
        return new ProductDto(p);
    }
}