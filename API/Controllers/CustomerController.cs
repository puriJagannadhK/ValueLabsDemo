using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using CustomerDetails.DAL;
using CustomerDetails.Models;
using System.Linq;

namespace CustomerDetails.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerDBContext _context;
        private readonly IConfiguration _configuration;

        public CustomerController(CustomerDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Authentication Endpoint
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            // Validate user credentials 
            var user = _context.CustomersEntity.FirstOrDefault(c => c.Email == model.Username && c.PasswordHash == model.Password);
            if (user == null) return Unauthorized();

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim("Role", user.Role) 
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: signIn
                );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                username = user.FirstName, 
                role = user.Role       
            });
        }

    
       [Authorize]
        [HttpGet]
        public IActionResult GetAllCustomers()
        {
         
            return Ok(_context.CustomersEntity.Where(x => x.Role.Equals("Customer")).ToList());
        }

        // GET: api/Customer/{id}
        [Authorize]
        [HttpGet("{id}")]
        public IActionResult GetCustomerById(int id)
        {
            var customer = _context.CustomersEntity.Find(id);
            if (customer == null) return NotFound();

            return Ok(customer);
        }

        // POST: api/Customer
        [Authorize]
        [HttpPost]
        public IActionResult CreateCustomer([FromBody] CustomerEntity customer)
        {
            if (customer == null) return BadRequest("Customer data is required.");
            if (string.IsNullOrEmpty(customer.FirstName) || string.IsNullOrEmpty(customer.LastName))
                return BadRequest("First Name and Last Name are required.");

            customer.CreatedDate = DateTime.UtcNow; 
            customer.IsActive = true;  

            _context.CustomersEntity.Add(customer);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetCustomerById), new { id = customer.UserId }, customer);
        }


        // PUT: api/Customer/{id}
        //[Authorize(Policy = "AdminOnly")]
        [Authorize]
        [HttpPut("{id}")]
        public IActionResult UpdateCustomer(int id, [FromBody] CustomerEntity updatedCustomer)
        {
            if (updatedCustomer == null) return BadRequest("Customer data is required.");

            var customer = _context.CustomersEntity.Find(id);
            if (customer == null) return NotFound("Customer not found.");

            if (string.IsNullOrEmpty(updatedCustomer.FirstName) || string.IsNullOrEmpty(updatedCustomer.LastName))
                return BadRequest("First Name and Last Name are required.");

            customer.FirstName = updatedCustomer.FirstName;
            customer.LastName = updatedCustomer.LastName;
            customer.PhoneNumber = updatedCustomer.PhoneNumber;
            customer.Email = updatedCustomer.Email;

            _context.SaveChanges();
            return Ok(customer); 
        }


        // DELETE: api/Customer/{id}
        // [Authorize(Policy = "AdminOnly")]
        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult DeleteCustomer(int id)
        {
            var customer = _context.CustomersEntity.Find(id);
            if (customer == null) return NotFound();

            _context.CustomersEntity.Remove(customer);
            _context.SaveChanges();
            return NoContent();
        }
    }

}
