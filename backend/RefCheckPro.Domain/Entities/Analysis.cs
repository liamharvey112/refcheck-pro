using System.Text.Json;

namespace RefCheckPro.Domain.Entities;

public class Analysis
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    // Input data
    public string JobDescription { get; set; } = string.Empty;
    public string ResumeText { get; set; } = string.Empty;
    public string? LinkedInProfile { get; set; }
    public string? ResumeFileName { get; set; }
    
    // Results (stored as JSON in database)
    public string InconsistenciesJson { get; set; } = "[]";
    public string QuestionsJson { get; set; } = "[]";
    public string MissingSkillsJson { get; set; } = "[]";
    public string Risk { get; set; } = "Medium";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Helper properties for easy access
    public List<string> Inconsistencies
    {
        get => JsonSerializer.Deserialize<List<string>>(InconsistenciesJson) ?? new List<string>();
        set => InconsistenciesJson = JsonSerializer.Serialize(value);
    }
    
    public List<string> Questions
    {
        get => JsonSerializer.Deserialize<List<string>>(QuestionsJson) ?? new List<string>();
        set => QuestionsJson = JsonSerializer.Serialize(value);
    }
    
    public List<string> MissingSkills
    {
        get => JsonSerializer.Deserialize<List<string>>(MissingSkillsJson) ?? new List<string>();
        set => MissingSkillsJson = JsonSerializer.Serialize(value);
    }
}