import { useState, useEffect, useRef } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import { useToast } from '../contexts/ToastContext';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { FileUpload } from '../components/FileUpload';
import { getRiskColor } from '../utils/formatters';

export const AnalyseView = () => {
    const { showToast } = useToast();
    const { analyse, loading, result, error, validationErrors } = useAnalysis();
    const [jobDescription, setJobDescription] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [resumeFileName, setResumeFileName] = useState<string | null>(null);
    const [linkedInProfile, setLinkedInProfile] = useState('');
    const [useFileUpload, setUseFileUpload] = useState(false);

     const resultShown = useRef(false);
    const errorShown = useRef(false);

    useEffect(() => {
        if (result && !resultShown.current) {
            resultShown.current = true;
            showToast('Analysis completed successfully!', 'success');
        }
    }, [result, showToast]);

    useEffect(() => {
        if (error && !errorShown.current) {
            errorShown.current = true;
            showToast(error, 'error');
        }
    }, [error, showToast]);

    const handleFileUploadComplete = (extractedText: string, fileName: string) => {
        setResumeText(extractedText);
        setResumeFileName(fileName);
        setUseFileUpload(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        resultShown.current = false;
        errorShown.current = false;
        analyse({ jobDescription, resumeText, linkedInProfile, resumeFileName });
    };

    return (
        <PageLayout title="Analyse Candidate">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-4 border-b pb-4">
                    <Button variant={!useFileUpload ? 'primary' : 'outline'} onClick={() => setUseFileUpload(false)}>
                        Paste Text
                    </Button>
                    <Button variant={useFileUpload ? 'primary' : 'outline'} onClick={() => setUseFileUpload(true)}>
                        Upload PDF
                    </Button>
                </div>

                <Textarea
                    label="Job Description"
                    value={jobDescription}
                    onChange={setJobDescription}
                    placeholder="Paste the job description here..."
                    rows={8}
                    error={validationErrors.jobDescription}
                    required
                />

                {useFileUpload ? (
                    <FileUpload onUploadComplete={handleFileUploadComplete} />
                ) : (
                    <Textarea
                        label="Resume Text"
                        value={resumeText}
                        onChange={setResumeText}
                        placeholder="Paste the resume text here..."
                        rows={10}
                        error={validationErrors.resumeText}
                        required
                    />
                )}

                <Textarea
                    label="LinkedIn Profile (optional)"
                    value={linkedInProfile}
                    onChange={setLinkedInProfile}
                    placeholder="Paste LinkedIn profile text here..."
                    rows={4}
                />

                <Button type="submit" loading={loading} fullWidth>
                    {loading ? 'Analysing...' : 'Analyse Candidate'}
                </Button>
            </form>

            {error && <Alert type="error" message={error} className="mt-4" />}

            {result && (
                <div className="mt-8 space-y-4">
                    <Card title="Risk Assessment">
                        <Badge variant={getRiskColor(result.risk)}>{result.risk} Risk</Badge>
                    </Card>
                    <Card title="Inconsistencies Found">
                        {result.inconsistencies.length === 0 ? (
                            <p className="text-gray-500">No inconsistencies found</p>
                        ) : (
                            <ul className="list-disc pl-5 space-y-1">
                                {result.inconsistencies.map((item: string, i: number) => (
                                    <li key={i} className="text-red-600">{item}</li>
                                ))}
                            </ul>
                        )}
                    </Card>
                    <Card title="Questions to Ask">
                        {result.questions.length === 0 ? (
                            <p className="text-gray-500">No suggested questions</p>
                        ) : (
                            <ul className="list-decimal pl-5 space-y-2">
                                {result.questions.map((item: string, i: number) => (
                                    <li key={i} className="text-gray-700">{item}</li>
                                ))}
                            </ul>
                        )}
                    </Card>
                    <Card title="Missing Skills">
                        <div className="flex flex-wrap gap-2">
                            {result.missingSkills.length === 0 ? (
                                <p className="text-gray-500">No missing skills identified</p>
                            ) : (
                                result.missingSkills.map((skill: string, i: number) => (
                                    <Badge key={i} variant="warning">{skill}</Badge>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </PageLayout>
    );
};