using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.RequestDtos;
using Service.Security;

namespace API;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoryController(CategoryService service) : ControllerBase
{
    [HttpGet]
    public List<CategoryDto> GetCategories()
    {
        return service.GetCategories();
    }

    [Authorize(Roles = UserRoles.Admin)]
    [HttpPost]
    public CategoryDto CreateCategory(CreateCategoryRequestDto dto)
    {
        return service.CreateCategory(dto);
    }

    [Authorize(Roles = UserRoles.Admin)]
    [HttpPut("{id}")]
    public CategoryDto UpdateCategory(string id, UpdateCategoryRequestDto dto)
    {
        return service.UpdateCategory(id, dto);
    }
    
    [Authorize(Roles = UserRoles.Admin)]
    [HttpDelete("{id}")]
    public IActionResult DeleteCategory(string id)
    {
        service.DeleteCategory(id);
        return NoContent();
    }
}