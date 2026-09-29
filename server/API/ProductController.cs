namespace API;

using Infra;
using Microsoft.AspNetCore.Mvc;
using Service;

public class ProductController(ProductService service) : ControllerBase
{
    [HttpGet(nameof(GetProducts))]
    public List<Product> GetProducts(int page, int resultsPerPage)
    {
        return service.GetProducts(page, resultsPerPage);
    }
}