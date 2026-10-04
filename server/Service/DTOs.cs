using Facet;
using Infra;

namespace Service;

[Facet(sourceType:typeof(Category), exclude:nameof(Category.ProductsByCategory))]
public partial class CategoryDto;

[Facet(sourceType: typeof(Product), exclude:nameof(Product.Category))]
public partial class ProductDto
{
    public CategoryDto Category { get; set; }
}

[Facet(sourceType: typeof(User), exclude: nameof(User.PasswordHash))]
public partial class UserDto;