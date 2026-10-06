using System.Security.Claims;
using System.Text;
using Infra;
using LinqToDB;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Service;
using Service.Security;

var builder = WebApplication.CreateBuilder(args);

var options = new DataOptions<MyDatabaseConnection>(
    new DataOptions().UseSQLite("Data Source=../Infra/db.db"));

//Register the token service
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException();
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException();
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException();
var jwtExpiresMinutes = builder.Configuration.GetValue<int>("Jwt:ExpiresMinutes", 60);

//Configure JWT Validation
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtIssuer,

                ValidateAudience = true,
                ValidAudience = jwtAudience,

                ValidateLifetime = true,

                ValidateIssuerSigningKey = true,
                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)),

                NameClaimType = ClaimTypes.Name,
                RoleClaimType = ClaimTypes.Role
            };
    });


builder.Services.AddScoped<MyDatabaseConnection>(_ =>
    new MyDatabaseConnection(options));
builder.Services.AddScoped<Seeder>();

builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<IPasswordHasher, Argon2PasswordHasher>();

//Dependency-Injection phase
builder.Services.AddScoped<ITokenService>(_ => 
    new JwtTokenService(
        jwtKey,
        jwtIssuer,
        jwtAudience,
        jwtExpiresMinutes
    ));

builder.Services.AddControllers();

//Adding Bearer authorization schema to Swagger
builder.Services.AddOpenApiDocument(document =>
{
    document.DocumentProcessors.Add(
        new NSwag.Generation.Processors.Security.SecurityDefinitionAppender(
            "Bearer",
            new NSwag.OpenApiSecurityScheme
            {
                Type = NSwag.OpenApiSecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "Enter your JWT bearer token"
            }));
    
    document.OperationProcessors.Add(
        new NSwag.Generation.Processors.Security
            .AspNetCoreOperationSecurityScopeProcessor("Bearer"));
});

builder.Services.AddCors();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<MyExceptionHandler>();

var app = builder.Build();

//Seeder
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<Seeder>();
    seeder.Seed();
}

app.UseExceptionHandler();
app.UseCors(config => config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().SetIsOriginAllowed(_ => true));

//Identifies who the user is; it established the authenticated identity from the bearer token
app.UseAuthentication();

//Determines what the authenticated user is permitted to do; it evaluates the [Authorize] policies/roles
app.UseAuthorization();

app.MapControllers();

app.UseOpenApi();
app.UseSwaggerUi();

app.Run();