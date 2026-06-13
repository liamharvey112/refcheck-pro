using System.Text;
using UglyToad.PdfPig;
using RefCheckPro.Domain.Interfaces;

namespace RefCheckPro.Infrastructure.Services;

public class PdfService : IPdfService
{
    public async Task<string> ExtractTextAsync(Stream pdfStream, string fileName)
    {
        return await Task.Run(() =>
        {
            var text = new StringBuilder();
            
            pdfStream.Position = 0;
            using (var pdf = PdfDocument.Open(pdfStream))
            {
                foreach (var page in pdf.GetPages())
                {
                    text.Append(page.Text);
                }
            }
            
            var result = text.ToString();
            return string.IsNullOrWhiteSpace(result) 
                ? "No text could be extracted. Please ensure this is a text-based PDF (not a scanned image)." 
                : result;
        });
    }
}