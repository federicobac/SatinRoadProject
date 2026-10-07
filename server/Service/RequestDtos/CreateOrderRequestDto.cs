namespace Service.RequestDtos;

public class CreateOrderRequestDto
{
    public string ProductId { get; set; }
    public int Quantity { get; set; }
}