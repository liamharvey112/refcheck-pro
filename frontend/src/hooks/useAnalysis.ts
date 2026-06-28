import { useState } from 'react';
import { analysisApi } from '../services/api';
import { validators } from '../utils/validators';
import { type AnalysisResult } from '../types/analysis.types';

export const useAnalysis = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const analyse = async (data: {
        jobDescription: string;
        resumeText: string;
        linkedInProfile?: string;
        resumeFileName?: string | null;
    }) => {
        const errors: Record<string, string> = {};
        const jdError = validators.jobDescription(data.jobDescription);
        const resumeError = validators.resumeText(data.resumeText);
        if (jdError) errors.jobDescription = jdError;
        if (resumeError) errors.resumeText = resumeError;
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        setValidationErrors({});
        setLoading(true);
        setError(null);
        try {
            const result = await analysisApi.analyse(data);
            setResult(result);
        } catch (err) {
            setError('Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return { analyse, loading, result, error, validationErrors };
};