using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Service;

[Authorize]
public class ProductController(ProductService service) : ControllerBase
{
    [HttpGet(nameof(GetProducts))]
    public List<ProductDto> GetProducts(int page, int resultsPerPage)
    {
        return service.GetProducts(page, resultsPerPage);
    }

    [HttpPost(nameof(CreateProduct))]
    public ProductDto CreateProduct(CreateProductRequestDto productRequestDto)
    {
        return service.CreateProduct(productRequestDto);
    }
    
}