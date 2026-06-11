using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RefCheckPro.Domain.Entities;
using RefCheckPro.Domain.Interfaces;
using System.Security.Claims;

namespace RefCheckPro.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalysisController : ControllerBase
{
    private readonly IAnalysisRepository _analysisRepository;

    public AnalysisController(IAnalysisRepository analysisRepository)
    {
        _analysisRepository = analysisRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyAnalyses()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var analyses = await _analysisRepository.GetByUserIdAsync(userId);
        return Ok(analyses);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAnalysis([FromBody] CreateAnalysisRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var analysis = new Analysis
        {
            UserId = userId,
            JobDescription = request.JobDescription,
            ResumeText = request.ResumeText,
            LinkedInProfile = request.LinkedInProfile,
            ResumeFileName = request.ResumeFileName,
            Inconsistencies = request.Inconsistencies,
            Questions = request.Questions,
            MissingSkills = request.MissingSkills,
            Risk = request.Risk
        };

        var created = await _analysisRepository.CreateAsync(analysis);
        return Ok(created);
    }
}

public class CreateAnalysisRequest
{
    public string JobDescription { get; set; } = string.Empty;
    public string ResumeText { get; set; } = string.Empty;
    public string? LinkedInProfile { get; set; }
    public string? ResumeFileName { get; set; }
    public List<string> Inconsistencies { get; set; } = new List<string>();
    public List<string> Questions { get; set; } = new List<string>();
    public List<string> MissingSkills { get; set; } = new List<string>();
    public string Risk { get; set; } = "Medium";
}