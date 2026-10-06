using Infra;
using Infra.Entities;

namespace Service.Security;

public interface ITokenService
{
    string CreateToken(User user);
}