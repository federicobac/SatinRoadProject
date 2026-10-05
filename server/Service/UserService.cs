using System.ComponentModel.DataAnnotations;
using Infra;
using LinqToDB;
using Service.RequestDtos;
using Service.Security;

namespace Service;

public class UserService(MyDatabaseConnection db, 
    IPasswordHasher passwordHasher,
    ITokenService tokenService)
{
    public UserDto CreateUser(CreateUserRequestDto userRequestDto)
    {
        if (string.IsNullOrWhiteSpace(userRequestDto.Username))
            throw new ValidationException("Username is required");

        if (string.IsNullOrWhiteSpace(userRequestDto.Password))
            throw new ValidationException("Password is required");

        if (db.Users.Any(u => u.Username == userRequestDto.Username))
            throw new ValidationException("Username already exists");

        string passwordHash = passwordHasher.HashAndSaltPassword(userRequestDto.Password);

        var user = new User()
        {
            UserId = Guid.NewGuid().ToString(),
            Username = userRequestDto.Username,
            PasswordHash = passwordHash,
            Role = UserRoles.User
        };
        db.Insert(user);
        return new UserDto(user);
    }

    public LoginResponseDto? Login(LoginRequestDto loginRequestDto)
    {
        var user = db.Users
            .FirstOrDefault(u => u.Username == loginRequestDto.Username);

        if (user == null)
            return null;

        bool passwordIsValid = passwordHasher.VerifyHashedPassword(
            loginRequestDto.Password,
            user.PasswordHash);

        if (!passwordIsValid)
            return null;

        return new LoginResponseDto
        {
            Token = tokenService.CreateToken(user),
            User = new UserDto(user)
        };
    }

    public UserDto? GetById(string userId)
    {
        var user = db.Users
            .FirstOrDefault(u => u.UserId == userId);
        
        return user is null
            ? null
            : new UserDto(user);
    }
}