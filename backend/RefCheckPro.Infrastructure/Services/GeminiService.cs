using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using RefCheckPro.Domain.Interfaces;

namespace RefCheckPro.Infrastructure.Services;

public class GeminiSettings
{
    public string ApiKey { get; set; } = string.Empty;
}

public class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GeminiService(IOptions<GeminiSettings> settings, HttpClient httpClient)
    {
        _apiKey = settings.Value.ApiKey;
        _httpClient = httpClient;
    }

    public async Task<AnalysisResult> AnalyzeCandidateAsync(string jobDescription, string resumeText, string? linkedInProfile)
    {
        var prompt = BuildPrompt(jobDescription, resumeText, linkedInProfile);
        var response = await CallGeminiApiSync(prompt);
        return ParseResponse(response);
    }

    private string BuildPrompt(string jobDescription, string resumeText, string? linkedInProfile)
    {
        var today = DateTime.Now.ToString("MMMM yyyy");
        
        return $@"
        You are a hiring assistant. Analyze the following candidate. Today's Date is {today}.

        Job Description:
        {jobDescription}

        Resume:
        {resumeText}

        LinkedIn Profile:
        {linkedInProfile ?? "Not provided"}

        Return ONLY valid JSON. Do not invent information. Only flag clear, obvious issues.

        Important: 
        - Dates in the past are valid. Only flag dates that are literally impossible (e.g., year 2030).
        - {today} is the current date. Any date before this is in the past.

        Rules:
            1. Inconsistencies: Only flag if you see DIRECT contradictions (e.g., resume says 5 years, LinkedIn says 2). Do not flag normal formatting or future dates unless they are actually impossible.
            2. Questions: Ask about gaps, unclear experience, or missing qualifications.
            3. Missing skills: List skills from job description clearly missing from both resume and LinkedIn.
            4. Risk: Low (good match), Medium (some gaps), High (major missing requirements).

        Return JSON:
        {{
            ""inconsistencies"": [""only real contradictions""],
            ""questions"": [""clarifying questions""],
            ""missingSkills"": [""skills not found""],
            ""risk"": ""Low""
        }}";
    }

    private async Task<string> CallGeminiApiSync(string prompt)
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}";

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var response = await _httpClient.PostAsync(url, new StringContent(json, Encoding.UTF8, "application/json"));
        var responseContent = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Gemini API error: {response.StatusCode} - {responseContent}");
        }

        using var doc = JsonDocument.Parse(responseContent);
        return doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString() ?? throw new Exception("No text in Gemini response");
    }

    private AnalysisResult ParseResponse(string responseText)
{
    try 
    {
        var cleaned = responseText
            .Replace("```json", "")
            .Replace("```", "")
            .Trim();
        
        var startIndex = cleaned.IndexOf('{');
        var endIndex = cleaned.LastIndexOf('}');
        if (startIndex != -1 && endIndex != -1)
        {
            cleaned = cleaned.Substring(startIndex, endIndex - startIndex + 1);
        }

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true  // This fixes the mismatch
        };

        var result = JsonSerializer.Deserialize<AnalysisResult>(cleaned, options);
        return result ?? new AnalysisResult();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Parse error: {ex.Message}");
        Console.WriteLine($"Raw response: {responseText}");
        return new AnalysisResult { Risk = "High" };
    }
}
}
