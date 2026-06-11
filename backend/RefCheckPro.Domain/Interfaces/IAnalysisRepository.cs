using RefCheckPro.Domain.Entities;

namespace RefCheckPro.Domain.Interfaces;

public interface IAnalysisRepository
{
    Task<Analysis> CreateAsync(Analysis analysis);
    Task<List<Analysis>> GetByUserIdAsync(Guid userId);
    Task<Analysis?> GetByIdAsync(Guid id);
}