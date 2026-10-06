using Facet;
using Infra.Entities;

namespace Service.RequestDtos;

[Facet(sourceType: typeof(Product), 
    exclude: [
        nameof(Product.ProductId), 
        nameof(Product.SellerId), 
        nameof(Product.Category)])]
public partial class UpdateProductRequestDto;