using Microsoft.AspNetCore.Mvc;
using Service;

namespace API;

[ApiController]
[Route("api/[controller]")]
public class CategoryController(CategoryService service) : ControllerBase
{
    [HttpGet]
    public List<CategoryDto> GetCategories()
    {
        return service.GetCategories();
    }

    [HttpPost]
    public CategoryDto CreateCategory(CreateCategoryRequestDto dto)
    {
        return service.CreateCategory(dto);
    }

    [HttpPut("{id}")]
    public CategoryDto UpdateCategory(string id, UpdateCategoryRequestDto dto)
    {
        return service.UpdateCategory(id, dto);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCategory(string id)
    {
        service.DeleteCategory(id);
        return NoContent();
    }
}