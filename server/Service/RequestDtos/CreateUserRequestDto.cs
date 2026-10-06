using Facet;
using Infra.Entities;

namespace Service.RequestDtos;

[Facet(sourceType: typeof(User), exclude:
[
    nameof(User.UserId), nameof(User.PasswordHash), nameof(User.Role)
])]
public partial class CreateUserRequestDto
{
    public string Password { get; set; }
}