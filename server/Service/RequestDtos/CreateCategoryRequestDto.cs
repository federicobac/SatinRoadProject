using Facet;
using Infra.Entities;

namespace Service.RequestDtos;

[Facet(sourceType: typeof(Category), 
    exclude: [nameof(Category.CategoryId), nameof(Category.ProductsByCategory)])]
public partial class CreateCategoryRequestDto;