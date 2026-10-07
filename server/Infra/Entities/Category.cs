using LinqToDB.Mapping;

namespace Infra.Entities;

public class Category
{
    [PrimaryKey] public string CategoryId { get; set; }
    public string CategoryName { get; set; }
    [Association(ThisKey = nameof(CategoryId), OtherKey = nameof(Product.CategoryId))]
    public List<Product> ProductsByCategory { get; set; }
}