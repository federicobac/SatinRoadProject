using LinqToDB.Mapping;

namespace Infra;

public class Product
{
    [PrimaryKey] public string ProductId { get; set; }
    public string ProductName { get; set; }
    public string CategoryId { get; set; }
    [Association(ThisKey = nameof(CategoryId), OtherKey = nameof(Category.CategoryId))]
    public Category Category { get; set; }
}

public class Category
{
    [PrimaryKey] public string CategoryId { get; set; }
    public string CategoryName { get; set; }
    [Association(ThisKey = nameof(CategoryId), OtherKey = nameof(Product.ProductId))]
    public List<Product> ProductsByCategory { get; set; }
}