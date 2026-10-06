using System.ComponentModel.DataAnnotations;
using Infra;
using Infra.Entities;
using LinqToDB;
using Service.RequestDtos;

namespace Service;

public class CategoryService(MyDatabaseConnection db)
{
    public List<CategoryDto> GetCategories()
    {
        return db.Categories
            .Select(c => new CategoryDto(c))
            .ToList();
    }

    public CategoryDto CreateCategory(CreateCategoryRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CategoryName))
            throw new ValidationException("Category name is required");
        
        if (db.Categories.Any(c => c.CategoryName == dto.CategoryName))
            throw new ValidationException("Category already exists");
        
        var category = new Category()
        {
            CategoryId = Guid.NewGuid().ToString(),
            CategoryName = dto.CategoryName
        };
        db.Insert(category);
        return new CategoryDto(category);
    }

    public CategoryDto UpdateCategory(string id, UpdateCategoryRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CategoryName))
            throw new ValidationException("Category name is required");

        var category = db.Categories
            .FirstOrDefault(c => c.CategoryId == id);
        
        if (category is null)
            throw new ValidationException("Category not found");

        category.CategoryName = dto.CategoryName;

        db.Update(category);
        return new CategoryDto(category);
    }

    public CategoryDto DeleteCategory(string id)
    {
        var category = db.Categories
            .FirstOrDefault(c => c.CategoryId == id);

        if (category is null)
            throw new ValidationException("Category not found");
        
        if (db.Products.Any(p => p.CategoryId == id))
            throw new ValidationException("Category cannot be deleted while products use it");

        db.Delete(category);
        return new CategoryDto(category);
    }
}