using Facet;
using Infra;

namespace Service;

[Facet(sourceType:typeof(Product), exclude: [nameof(Product.Category), nameof(Product.ProductId)])]
public partial class CreateProductRequestDto;