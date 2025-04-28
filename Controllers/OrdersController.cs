using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyAspNetCoreServer.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAspNetCoreServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(ApplicationDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            try
            {
                return await _context.Orders
                    .Include(o => o.OrderItems)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving orders");
            }
        }

        [HttpGet("user/{username}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetUserOrders(string username)
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.OrderItems)
                    .Where(o => o.UserName == username)
                    .ToListAsync();

                return orders;
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving user orders");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { 
                        message = "Validation failed",
                        errors = ModelState.Values
                            .SelectMany(v => v.Errors)
                            .Select(e => e.ErrorMessage)
                            .ToList()
                    });
                }

                if (request.Items == null || !request.Items.Any())
                {
                    return BadRequest("Order must contain at least one item");
                }

                var order = new Order
                {
                    UserId = request.UserId,
                    UserName = request.UserName,
                    Email = request.Email,
                    Address = request.Address,
                    PaymentMethod = request.PaymentMethod,
                    TotalAmount = request.TotalAmount,
                    OrderDate = DateTime.UtcNow,
                    OrderItems = request.Items.Select(item => new OrderItem
                    {
                        ProductId = item.ProductId,
                        ProductName = item.ProductName,
                        Price = item.Price,
                        Quantity = item.Quantity
                    }).ToList()
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, "An error occurred while saving the order to the database");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while creating the order");
            }
        }
    }

    public class CreateOrderRequest
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string PaymentMethod { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemRequest> Items { get; set; }
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
} 