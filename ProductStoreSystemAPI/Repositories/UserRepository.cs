﻿using Microsoft.EntityFrameworkCore;
using ProductStoreSystemAPI.Data;
using ProductStoreSystemAPI.Models;
using ProductStoreSystemAPI.Repositories.Interfaces;
using System.Data;

namespace ProductStoreSystemAPI.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User_Ps?> GetUserByEmailAsync(string email)
    {
        return await _context.Users_Ps.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task AddUserAsync(User_Ps user)
    {
        await _context.Users_Ps.AddAsync(user);
    }

    public async Task<bool> IsEmailTakenAsync(string email)
    {
        return await _context.Users_Ps.AnyAsync(u => u.Email == email);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task<sbyte> IsAdmin()
    {
        // first user beccomes admin (Role = 1), others are customers (Role = 0)
        return (sbyte)(!(await _context.Users_Ps.AnyAsync()) ? 1 : 0);
    }
}
