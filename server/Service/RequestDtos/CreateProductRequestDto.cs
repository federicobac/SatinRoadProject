using Facet;
using Infra.Entities;

namespace Service.RequestDtos;

[Facet(sourceType:typeof(Product), 
    exclude: [
        nameof(Product.Category), 
        nameof(Product.ProductId),
        nameof(Product.SellerId)
    ])]
public partial class CreateProductRequestDto;