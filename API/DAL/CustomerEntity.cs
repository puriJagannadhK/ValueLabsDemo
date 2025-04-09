using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CustomerDetails.DAL
{
    [Table("CR_Users")]
    public class CustomerEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public int UserId { get; set; }
            public string FirstName { get; set; }

            public string LastName { get; set; }
            public string Email { get; set; }

            public string PasswordHash { get; set; }

            public string PhoneNumber { get; set; }

            public string Role { get; set; }

            public DateTime CreatedDate { get; set; }

            public bool IsActive { get; set; }
        }

    }


