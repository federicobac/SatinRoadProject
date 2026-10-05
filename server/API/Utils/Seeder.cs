using Infra;
using LinqToDB;
using Service.Security;

public class Seeder(
    MyDatabaseConnection db,
    IPasswordHasher passwordHasher,
    IConfiguration configuration)
{
    public void Seed()
    {
        db.CreateTable<Product>(tableOptions:TableOptions.CreateIfNotExists);
        db.CreateTable<Category>(tableOptions:TableOptions.CreateIfNotExists);
        db.CreateTable<User>(tableOptions:TableOptions.CreateIfNotExists);
    
        if (db.Categories.Count() == 0)
        {
            db.Insert(new Category()
            {
                CategoryId = "1",
                CategoryName = "stolen product",
            });
        }
    
        if (db.Products.Count() == 0)
        {
            db.Insert(new Product()
            {
                ProductId = "1",
                ProductName = "product 1",
                CategoryId = "1",
            });
        }
        
        var adminPassword = configuration["SeedAdmin:Password"];
        
        Console.WriteLine($"Admin password configured: {!string.IsNullOrWhiteSpace(adminPassword)}");
        Console.WriteLine($"Admin exists: {db.Users.Any(u => u.Username == "admin")}");

        if (!string.IsNullOrWhiteSpace(adminPassword) && 
            !db.Users.Any(u => u.Username == "admin"))
        {
            Console.WriteLine("Creating admin user...");
            
            db.Insert(new User
            {
                UserId = Guid.NewGuid().ToString(),
                Username = "admin",
                PasswordHash = passwordHasher.HashAndSaltPassword(adminPassword),
                Role = UserRoles.Admin
            });
        }
    }
}