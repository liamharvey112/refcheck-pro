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
    private readonly IGeminiService _geminiService;

    public AnalysisController(IAnalysisRepository analysisRepository, IGeminiService geminiService)
    {
        _analysisRepository = analysisRepository;
        _geminiService = geminiService;
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

        var aiResult = await _geminiService.AnalyzeCandidateAsync(
            request.JobDescription,
            request.ResumeText,
            request.LinkedInProfile
        );

        var analysis = new Analysis
        {
            UserId = userId,
            JobDescription = request.JobDescription,
            ResumeText = request.ResumeText,
            LinkedInProfile = request.LinkedInProfile,
            ResumeFileName = request.ResumeFileName,
            Inconsistencies = aiResult.Inconsistencies,
            Questions = aiResult.Questions,
            MissingSkills = aiResult.MissingSkills,
            Risk = aiResult.Risk
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
}