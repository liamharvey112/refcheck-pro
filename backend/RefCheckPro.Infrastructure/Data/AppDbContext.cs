using Microsoft.EntityFrameworkCore;
using RefCheckPro.Domain.Entities;

namespace RefCheckPro.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Analysis> Analyses { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.AuthProviderId);
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.Name).IsRequired();
        });
        
        modelBuilder.Entity<Analysis>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.InconsistenciesJson).HasDefaultValue("[]");
            entity.Property(e => e.QuestionsJson).HasDefaultValue("[]");
            entity.Property(e => e.MissingSkillsJson).HasDefaultValue("[]");
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Analyses)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}