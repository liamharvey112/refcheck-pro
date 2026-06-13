import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FileUpload } from './FileUpload';

const API_BASE = 'http://localhost:5216/api';

interface AnalysisResult {
  id: string;
  inconsistencies: string[];
  questions: string[];
  missingSkills: string[];
  risk: string;
}

export const AnalysisForm = () => {
  const { token } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [linkedInProfile, setLinkedInProfile] = useState('');
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUploadComplete = (extractedText: string, fileName: string) => {
    setResumeText(extractedText);
    setResumeFileName(fileName);
    setUseFileUpload(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        `${API_BASE}/analysis`,
        { 
          jobDescription, 
          resumeText, 
          linkedInProfile,
          resumeFileName 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Toggle between paste and upload */}
        <div className="flex gap-4 border-b pb-4">
          <button
            type="button"
            onClick={() => setUseFileUpload(false)}
            className={`px-4 py-2 rounded-lg ${!useFileUpload ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Paste Text
          </button>
          <button
            type="button"
            onClick={() => setUseFileUpload(true)}
            className={`px-4 py-2 rounded-lg ${useFileUpload ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Upload PDF
          </button>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 h-40"
            placeholder="Paste the job description here..."
            required
          />
        </div>

        {/* Resume */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume
          </label>
          {useFileUpload ? (
            <div>
              <FileUpload onUploadComplete={handleFileUploadComplete} />
              {resumeText && resumeFileName && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-green-800">{resumeFileName}</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {resumeText.length} characters extracted. Ready for analysis.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 h-40"
              placeholder="Paste the resume text here..."
              required
            />
          )}
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile (optional)
          </label>
          <textarea
            value={linkedInProfile}
            onChange={(e) => setLinkedInProfile(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 h-32"
            placeholder="Paste LinkedIn profile text here..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Candidate'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result.risk)}`}>
              {result.risk} Risk
            </span>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Inconsistencies Found</h3>
            {result.inconsistencies.length === 0 ? (
              <p className="text-gray-500">No inconsistencies found</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {result.inconsistencies.map((item, i) => (
                  <li key={i} className="text-red-600">{item}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Questions to Ask</h3>
            {result.questions.length === 0 ? (
              <p className="text-gray-500">No suggested questions</p>
            ) : (
              <ul className="list-decimal pl-5 space-y-2">
                {result.questions.map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Missing Skills</h3>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.length === 0 ? (
                <p className="text-gray-500">No missing skills identified</p>
              ) : (
                result.missingSkills.map((skill, i) => (
                  <span key={i} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};