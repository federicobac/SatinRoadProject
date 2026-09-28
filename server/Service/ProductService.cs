namespace Service;

using Infra;

public class ProductService(MyDatabaseConnection db)
{
    public List<Product> GetProducts()
    {
        return db.Products.ToList();
    }
}