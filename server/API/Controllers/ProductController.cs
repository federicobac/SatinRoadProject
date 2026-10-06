using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Service.RequestDtos;

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
    public ProductDto CreateProduct(CreateProductRequestDto dto)
    {
        var sellerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (sellerId is null)
            throw new UnauthorizedAccessException();
        
        return service.CreateProduct(dto, sellerId);
    }
    
}