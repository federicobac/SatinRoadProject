using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Service.RequestDtos;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

[Authorize]
public class ProductController(ProductService service) : ControllerBase
{
    [HttpGet(nameof(GetProducts))]
    public List<ProductDto> GetProducts(int page, int resultsPerPage)
    {
        return service.GetProducts(page, resultsPerPage);
    }

    [HttpGet("mine")]
    public ActionResult<List<ProductDto>> GetMyProducts()
    {
        var sellerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (sellerId is null) 
            return Unauthorized();
        
        return Ok(service.GetMyProducts(sellerId));
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