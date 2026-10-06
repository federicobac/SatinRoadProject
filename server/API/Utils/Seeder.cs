using Infra;
using Infra.Entities;
using LinqToDB;
using Service.Security;

namespace API.Utils;

public class Seeder(
    MyDatabaseConnection db,
    IPasswordHasher passwordHasher,
    IConfiguration configuration)
{
    public void Seed()
    {
        db.CreateTable<User>(tableOptions:TableOptions.CreateIfNotExists);
        db.CreateTable<Product>(tableOptions:TableOptions.CreateIfNotExists);
        db.CreateTable<Category>(tableOptions:TableOptions.CreateIfNotExists);
        
        //seed admin
        var adminPassword = configuration["SeedAdmin:Password"];
        
        if (!string.IsNullOrWhiteSpace(adminPassword) && 
            !db.Users.Any(u => u.Username == "admin"))
        {
            
            db.Insert(new User
            {
                UserId = Guid.NewGuid().ToString(),
                Username = "admin",
                PasswordHash = passwordHasher.HashAndSaltPassword(adminPassword),
                Role = UserRoles.Admin
            });
        }
        
        //seed user
        var userPassword = configuration["SeedUser:Password"];
        
        if (!string.IsNullOrWhiteSpace(userPassword) && 
            !db.Users.Any(u => u.Username == "user"))
        {
            
            db.Insert(new User
            {
                UserId = Guid.NewGuid().ToString(),
                Username = "user",
                PasswordHash = passwordHasher.HashAndSaltPassword(userPassword),
                Role = UserRoles.User
            });
        }
        
        //seed category
        if (db.Categories.Count() == 0)
        {
            db.Insert(new Category()
            {
                CategoryId = "1",
                CategoryName = "stolen product",
            });
        }
    
        //seed product
        if (db.Products.Count() == 0)
        {
            var seller = db.Users.
                First(u => u.Username == "user");
            
            db.Insert(new Product()
            {
                ProductId = "1",
                ProductName = "product 1",
                Inventory = 100,
                ProductPrice = 100,
                CategoryId = "1",
                SellerId = seller.UserId
            });
        }
    }
}