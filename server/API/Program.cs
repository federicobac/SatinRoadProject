using Infra;
using LinqToDB;
using Service;

var builder = WebApplication.CreateBuilder(args);

var options = new DataOptions<MyDatabaseConnection>(
        new DataOptions().UseSQLite("Data Source=db.db"));

builder.Services.AddScoped<MyDatabaseConnection>(_ =>
    new MyDatabaseConnection(options));

builder.Services.AddScoped<ProductService>();
builder.Services.AddControllers();
builder.Services.AddOpenApiDocument();
builder.Services.AddCors();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<MyExceptionHandler>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MyDatabaseConnection>();
    db.CreateTable<Product>(tableOptions:TableOptions.CreateIfNotExists);
    if (db.Products.Count() == 0)
    {
        db.Insert(new Product()
        {
            ProductId = "1",
            ProductName = "stolen product",
        });
    }
}

app.UseExceptionHandler();
app.UseCors(config => config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().SetIsOriginAllowed(_ => true));
app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();

app.Run();