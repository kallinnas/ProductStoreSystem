﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductStoreSystemAPI.Data;
using ProductStoreSystemAPI.Models;

namespace ProductStoreSystemAPI.Controllers;


[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "1")] // only admins (Role = 1) can access
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context) { _context = context; }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _context.Products.ToListAsync();
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(ProductDto dto)
    {
        try
        {
            var product = new Product
            {
                Name = dto.Name,
                Desc = dto.Desc,
                Price = dto.Price
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, dto);
        }

        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(long id)
    {
        try
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

