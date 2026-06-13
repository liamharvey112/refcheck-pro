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
    private readonly IPdfService _pdfService;

    public AnalysisController(IAnalysisRepository analysisRepository, IGeminiService geminiService, IPdfService pdfService)
    {
        _analysisRepository = analysisRepository;
        _geminiService = geminiService;
        _pdfService = pdfService;
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

    [HttpPost("with-file")]
    public async Task<IActionResult> CreateAnalysisWithFile(
        [FromForm] string jobDescription,
        [FromForm] string? linkedInProfile,
        IFormFile resumeFile
    )
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        //Validate File
        if (resumeFile == null || resumeFile.Length == 0)
        {
            return BadRequest(new { message = "Resume File is required." });
        }

        if (resumeFile.ContentType != "application/pdf")
        {
            return BadRequest(new { message = "Only PDF files are allowed." });
        }

        using var stream = resumeFile.OpenReadStream();
        var resumeText = await _pdfService.ExtractTextAsync(stream, resumeFile.FileName);

        //Call Gemini AI
        var aiResult = await _geminiService.AnalyzeCandidateAsync(jobDescription, resumeText, linkedInProfile);

        var analysis = new Analysis
        {
            UserId = userId,
            JobDescription = jobDescription,
            ResumeText = resumeText,
            LinkedInProfile = linkedInProfile,
            ResumeFileName = resumeFile.FileName,
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