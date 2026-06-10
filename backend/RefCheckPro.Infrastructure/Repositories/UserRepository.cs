using Microsoft.EntityFrameworkCore;
using RefCheckPro.Domain.Entities;
using RefCheckPro.Domain.Interfaces;
using RefCheckPro.Infrastructure.Data;

namespace RefCheckPro.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User?> GetByAuthProviderIdAsync(string authProviderId)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.AuthProviderId == authProviderId);
    } 

    public async Task<User> CreateAsync(User user)
    {
        user.Id = Guid.NewGuid();
        user.CreatedAt = DateTime.UtcNow;
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
}