using RefCheckPro.Domain.Entities;

namespace RefCheckPro.Domain.Interfaces;


public interface IGeminiService
{
    Task<AnalysisResult> AnalyzeCandidateAsync(string jobDescription, string resumeText, string? linkedInProfile);
}

public class AnalysisResult
{
    public List<string> Inconsistencies { get; set; } = new ();
    public List<string> Questions { get; set; } = new ();
    public List<string> MissingSkills { get; set; } = new ();
    public string Risk { get; set; } = "Medium";
}