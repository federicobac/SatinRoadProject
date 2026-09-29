using System.ComponentModel.DataAnnotations;
using LinqToDB;

namespace Service;

using Infra;

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
}