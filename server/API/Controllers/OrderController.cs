using System.Security.Claims;
using Infra.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.RequestDtos;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController(OrderService service) : ControllerBase
{
    [HttpPost(nameof(CreateOrder))]
    public ActionResult<Order> CreateOrder(CreateOrderRequestDto dto)
    {
        var buyerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (buyerId is null)
            return Unauthorized();
        
        var order = service.CreateOrder(dto, buyerId);
        
        return Ok(order);
    }

    [HttpGet(nameof(GetMyOrders))]
    public ActionResult<List<OrderDto>> GetMyOrders()
    {
        var buyerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (buyerId is null)
            throw Unauthorized();
        
        var orders = service.GetMyOrders(buyerId);
        return Ok(orders);
    }
}