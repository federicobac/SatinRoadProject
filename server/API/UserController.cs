using Microsoft.AspNetCore.Mvc;
using Service;

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
    public ActionResult<UserDto> Login(LoginRequestDto loginRequestDto)
    {
        var user = service.Login(loginRequestDto);

        if (user is null)
            return Unauthorized();

        return Ok(user);
    }

}