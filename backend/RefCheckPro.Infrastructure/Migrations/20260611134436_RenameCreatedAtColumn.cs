using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RefCheckPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameCreatedAtColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE ""Analyses"" RENAME COLUMN ""CreateAt"" TO ""CreatedAt"";
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE ""Analyses"" RENAME COLUMN ""CreatedAt"" TO ""CreateAt"";
            ");
        }
    }
}
