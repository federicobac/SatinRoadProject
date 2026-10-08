using System.Security.Claims;
using API;
using Infra;
using LinqToDB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Security;

namespace Tests;

public class AuthorizationTests
{
    [Fact]
    public void Me_UnauthenticatedUser_ReturnsUnauthorized()
    {
        var options = new LinqToDB.DataOptions<MyDatabaseConnection>(
            new LinqToDB.DataOptions().UseSQLite("Data Source=:memory:"));
        
        using var db = new MyDatabaseConnection(options);

        var userService = new UserService(
            db,
            new Argon2PasswordHasher(),
            new JwtTokenService(
                "this-is-a-test-key-that-is-long-enough",
                "test-issuer",
                "test-audience",
                60));

        var controller = new UserController(userService);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(
                    new ClaimsIdentity())
            }
        };

        var result = controller.Me();
        
        Assert.IsType<UnauthorizedResult>(result.Result);
    }
}