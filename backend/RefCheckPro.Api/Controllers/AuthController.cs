using Microsoft.AspNetCore.Mvc;
using RefCheckPro.Infrastructure.Auth;
using RefCheckPro.Domain.Interfaces;

namespace RefCheckPro.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IGoogleAuthService _googleAuthService;
    private readonly IJwtService _jwtService;
    
    public AuthController(IGoogleAuthService googleAuthService, IJwtService jwtService)
    {
        _googleAuthService = googleAuthService;
        _jwtService = jwtService;
    }
    
    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        if (!string.IsNullOrEmpty(request.AccessToken))
        {
            var user = await _googleAuthService.AuthenticateWithAccessTokenAsync(request.AccessToken);
            
            if (user != null)
            {
                var token = _jwtService.GenerateToken(user);
                return Ok(new
                {
                    token,
                    user = new
                    {
                        user.Id,
                        user.Email,
                        user.Name,
                        user.AvatarUrl
                    }
                });
            }
        }
        
        if (!string.IsNullOrEmpty(request.IdToken))
        {
            var user = await _googleAuthService.AuthenticateGoogleTokenAsync(request.IdToken);
            
            if (user != null)
            {
                var token = _jwtService.GenerateToken(user);
                return Ok(new
                {
                    token,
                    user = new
                    {
                        user.Id,
                        user.Email,
                        user.Name,
                        user.AvatarUrl
                    }
                });
            }
        }
        
        return Unauthorized(new { message = "Invalid Google token" });
    }
}

public class GoogleLoginRequest
{
    public string IdToken { get; set; } = string.Empty;
    public string AccessToken { get; set; } = string.Empty;
}