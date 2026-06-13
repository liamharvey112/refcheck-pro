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
        You are a pragmatic hiring assistant. Today's date is {today}.

        Job Description:
        {jobDescription}

        Resume:
        {resumeText}

        LinkedIn Profile:
        {linkedInProfile ?? "Not provided"}

        GUIDELINES (not hard rules):

            1. YEARS OF EXPERIENCE:
                - Years are GUIDELINES, not requirements. Job descriptions often inflate years.
                - INFER seniority from ACCOMPLISHMENTS, not years:
                    * Leading migrations → senior behavior
                    * Writing architecture documents → senior behavior
                    * Owning projects solo → senior behavior
                    * Mentoring others → senior behavior
                    * Producing technical strategy → senior behavior
                - Do NOT use percentage thresholds. A candidate with 1.5-2 years but senior-level accomplishments can be a strong fit for roles asking for 3-5 years.

            2. TECHNICAL SKILLS:
                - Compare skills directly
                - Missing 1-2 nice-to-have skills → not a problem

            3. RISK TIERS:
                - Low: Skills align, candidate shows senior behaviors (even if years are fewer)
                - Medium: Significant skill gaps or completely wrong tech stack
                - High: No relevant experience at all

        Return ONLY valid JSON:
            {{
                ""inconsistencies"": [""only direct contradictions, never mention years alone""],
                ""questions"": [""focus on skills and projects, not years""],
                ""missingSkills"": [""skills genuinely missing""],
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
