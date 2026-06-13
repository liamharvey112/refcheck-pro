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
        You are a realistic hiring assistant. Today's date is {today}.

        Analyze the following candidate against the job description.

        Job Description:
        {jobDescription}

        Resume:
        {resumeText}

        LinkedIn Profile:
        {linkedInProfile ?? "Not provided"}

        RISK ASSESSMENT GUIDELINES:

        1. YEARS OF EXPERIENCE:
            - Candidate meets or exceeds required years → Low risk contribution
            - Candidate has 50-80% of required years → Medium risk contribution
            - Candidate has less than 50% of required years → High risk contribution

        2. TECHNICAL SKILLS:
            - All core technologies match → Low risk contribution
            - Missing 1-2 core technologies → Medium risk contribution
            - Missing 3+ core technologies → High risk contribution

        3. LEADERSHIP / SCOPE (if mentioned in JD):
            - Has led teams or projects at required scope → Low risk
            - Has participated but not led → Medium risk
            - No leadership experience when required → High risk

        4. SYSTEM SCALE (if mentioned in JD):
            - Experience at required scale → Low risk
            - Experience at smaller scale → Medium risk
            - No scale experience when required → High risk

        RISK TIERS:
            - Low: Candidate is a strong fit. Would recommend interview.
            - Medium: Candidate has significant gaps but could grow. Would consider if other candidates are weak.
            - High: Candidate is not qualified. Would not recommend interview.

        Return ONLY valid JSON:
        {{
            ""inconsistencies"": [""specific gaps between candidate and job requirements""],
            ""questions"": [""questions to determine if candidate can bridge the gaps""],
            ""missingSkills"": [""required skills the candidate lacks""],
            ""risk"": ""Low/Medium/High""
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
