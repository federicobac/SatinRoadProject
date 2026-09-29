using System.ComponentModel.DataAnnotations;

namespace Service;

using Infra;

public class ProductService(MyDatabaseConnection db)
{
    public List<Product> GetProducts(int page, int resultsPerPage)
    {
        if (page < 1)
            throw new ValidationException("Page must be 1 or higher");
        if (resultsPerPage < 1)
            throw new ValidationException("Must have at least 1 results per page");
        
        return db.Products
            .Take(resultsPerPage)
            .Skip((page - 1) * resultsPerPage)
            .ToList();
    }
}