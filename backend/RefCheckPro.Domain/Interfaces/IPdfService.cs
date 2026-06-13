namespace RefCheckPro.Domain.Interfaces;

public interface IPdfService
{
    Task<string> ExtractTextAsync(Stream pdfStream, string fileName);
}