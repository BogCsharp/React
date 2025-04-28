using MyAspNetCoreServer.Models;

public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        context.Database.EnsureCreated();

        if (!context.Users.Any())
        {
            context.Users.Add(new User
            {
                Username = "admin",
                Email = "admin@example.com",
                Password = "admin"
            });
            context.SaveChanges();
        }

        if (!context.Products.Any())
        {
            var random = new Random();
            var products = new List<Product>();

            for (int i = 1; i <= 100; i++)
            {
                products.Add(new Product
                {
                    Name = $"Товар {i}",
                    ReleaseDate = DateTime.Now.AddDays(-random.Next(1, 365)),
                    Price = random.Next(10, 1000)
                });
            }

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}