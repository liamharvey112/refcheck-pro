# RefCheck Pro

AI-powered candidate analysis tool. Compare resumes against job descriptions, get reference check questions, and spot inconsistencies.

## Tech Stack

- **Backend**: .NET 8 Web API, Entity Framework Core, PostgreSQL
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Auth**: Google OAuth 2.0, JWT
- **AI**: Google Gemini API
- **Database**: PostgreSQL (Supabase free tier)

## Development

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- Git

### Backend Setup
```bash
cd backend
dotnet restore
cd RefCheckPro.Api
dotnet run