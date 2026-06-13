using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RefCheckPro.Domain.Interfaces;

namespace RefCheckPro.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly IPdfService _pdfService;

    public UploadController(IPdfService pdfService)
    {
        _pdfService = pdfService;
    }

    [HttpPost("resume")]
    public async Task<IActionResult> UploadResume(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded." });
        }

        if (file.ContentType != "application/pdf")
        {
            return BadRequest(new { message = "Only PDF files are allowed." });
        }

        try 
        {
            using var stream = file.OpenReadStream();
            var extractedText = await _pdfService.ExtractTextAsync(stream, file.FileName);

            return Ok(new
            {
                fileName = file.FileName,
                fileSize = file.Length,
                extractedText = extractedText,
                textLength = extractedText.Length
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Error processing PDF: {ex.Message}" });
        }
    }
}