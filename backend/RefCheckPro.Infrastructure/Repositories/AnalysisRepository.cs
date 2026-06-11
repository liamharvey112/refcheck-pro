using Microsoft.EntityFrameworkCore;
using RefCheckPro.Domain.Entities;
using RefCheckPro.Domain.Interfaces;
using RefCheckPro.Infrastructure.Data;

namespace RefCheckPro.Infrastructure.Repositories;

public class AnalysisRepository : IAnalysisRepository
{
    private readonly AppDbContext _context;
    
    public AnalysisRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<Analysis> CreateAsync(Analysis analysis)
    {
        analysis.Id = Guid.NewGuid();
        _context.Analyses.Add(analysis);
        await _context.SaveChangesAsync();
        return analysis;
    }
    
    public async Task<List<Analysis>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Analyses
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }
    
    public async Task<Analysis?> GetByIdAsync(Guid id)
    {
        return await _context.Analyses.FindAsync(id);
    }
}