import { useState, useEffect } from 'react';
import { analysisApi } from '../services/api';
import { type Analysis } from '../types/analysis.types';

export const useHistory = () => {
    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalyses = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await analysisApi.getHistory();
            setAnalyses(data);
        } catch (err) {
            setError('Failed to load analysis history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyses();
    }, []);

    return { analyses, loading, error, refetch: fetchAnalyses };
};