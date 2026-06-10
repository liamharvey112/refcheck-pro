using System.Text.Json;
using Google.Apis.Auth;
using Microsoft.Extensions.Options;
using RefCheckPro.Domain.Entities;
using RefCheckPro.Domain.Interfaces;

namespace RefCheckPro.Infrastructure.Auth;

public class GoogleAuthSettings
{
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
}

public interface IGoogleAuthService
{
    Task<User?> AuthenticateGoogleTokenAsync(string idToken);
    Task<User?> AuthenticateWithAccessTokenAsync(string accessToken);
}

public class GoogleAuthService : IGoogleAuthService
{
    private readonly GoogleAuthSettings _settings;
    private readonly IUserRepository _userRepository;
    
    public GoogleAuthService(
        IOptions<GoogleAuthSettings> settings,
        IUserRepository userRepository)
    {
        _settings = settings.Value;
        _userRepository = userRepository;
    }
    
    public async Task<User?> AuthenticateGoogleTokenAsync(string idToken)
    {
        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _settings.ClientId }
            });
            
            var user = await _userRepository.GetByAuthProviderIdAsync(payload.Subject);
            
            if (user == null)
            {
                user = new User
                {
                    Email = payload.Email,
                    Name = payload.Name,
                    AuthProviderId = payload.Subject,
                    AvatarUrl = payload.Picture
                };
                user = await _userRepository.CreateAsync(user);
            }
            else
            {
                user.LastLoginAt = DateTime.UtcNow;
                await _userRepository.UpdateAsync(user);
            }
            
            return user;
        }
        catch
        {
            return null;
        }
    }
    
    public async Task<User?> AuthenticateWithAccessTokenAsync(string accessToken)
    {
        try
        {
            using var httpClient = new HttpClient();
            
            var response = await httpClient.GetAsync($"https://www.googleapis.com/oauth2/v3/tokeninfo?access_token={accessToken}");
            
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }
            
            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            
            var email = root.GetProperty("email").GetString();
            var subject = root.GetProperty("sub").GetString();
            
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(subject))
            {
                return null;
            }
            
            var name = email.Split('@')[0];
            
            var user = await _userRepository.GetByAuthProviderIdAsync(subject);
            
            if (user == null)
            {
                user = new User
                {
                    Email = email,
                    Name = name,
                    AuthProviderId = subject,
                    AvatarUrl = null
                };
                user = await _userRepository.CreateAsync(user);
            }
            else
            {
                user.LastLoginAt = DateTime.UtcNow;
                await _userRepository.UpdateAsync(user);
            }
            
            return user;
        }
        catch
        {
            return null;
        }
    }
}