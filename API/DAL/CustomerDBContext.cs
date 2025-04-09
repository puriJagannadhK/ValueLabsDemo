using Microsoft.EntityFrameworkCore;
namespace CustomerDetails.DAL
{
    public class CustomerDBContext: DbContext
    {
        public CustomerDBContext(DbContextOptions<CustomerDBContext> options) : base(options)
        {
        }
        public DbSet<CustomerEntity> CustomersEntity { get; set; }
    }
   
}
