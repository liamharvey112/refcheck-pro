using RefCheckPro.Domain.Entities;

namespace RefCheckPro.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByAuthProviderIdAsync(string authProviderId);
    Task<User> CreateAsync(User user);
    Task UpdateAsync(User user);
}