using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.RequestDtos;

namespace API;

[ApiController]
[Route("api/[controller]")]
public class UserController(UserService service) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost]
    public UserDto CreateUser(CreateUserRequestDto userRequestDto)
    {
        return service.CreateUser(userRequestDto);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public ActionResult<LoginResponseDto> Login(LoginRequestDto loginRequestDto)
    {
        var result = service.Login(loginRequestDto);

        if (result is null)
            return Unauthorized();

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<UserDto> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (userId is null)
            return Unauthorized();
        
        var user = service.GetById(userId);

        if (user is null)
            return Unauthorized();

        return Ok(user);

    }

}