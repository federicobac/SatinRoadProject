using Facet;
using Infra;

namespace Service;

[Facet(sourceType: typeof(User), exclude:
[
    nameof(User.UserId), nameof(User.PasswordHash), nameof(User.Role)
])]
public partial class CreateUserRequestDto
{
    public string Password { get; set; }
}