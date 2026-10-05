using Microsoft.AspNetCore.Mvc;
using Service;
using Service.RequestDtos;

namespace API;

[ApiController]
[Route("api/[controller]")]
public class UserController(UserService service) : ControllerBase
{
    [HttpPost]
    public UserDto CreateUser(CreateUserRequestDto userRequestDto)
    {
        return service.CreateUser(userRequestDto);
    }

    [HttpPost("login")]
    public ActionResult<LoginResponseDto> Login(LoginRequestDto loginRequestDto)
    {
        var result = service.Login(loginRequestDto);

        if (result is null)
            return Unauthorized();

        return Ok(result);
    }

}