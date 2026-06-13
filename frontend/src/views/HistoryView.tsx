import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { HistoryList } from "../components/history/HistoryList";
import { AnalysisDetailModal } from "../components/modals/AnalysisDetailModal";
import type { Analysis } from "../types/analysis.types";

const API_BASE = "http://localhost:5216/api";

export const HistoryView = () => {
    const { token } = useAuth();
    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

    useEffect(() => {
        fetchAnalyses();
    }, []);

    const fetchAnalyses = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE}/analysis`, { 
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
            setAnalyses(response.data);
        } catch (err) {
            setError('Failed to load analysis history.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Analysis History</h2>

            <HistoryList analyses={analyses} onSelect={setSelectedAnalysis} />

            <AnalysisDetailModal 
                analysis={selectedAnalysis}
                onClose={() => setSelectedAnalysis(null)}
            />
        </div>
    );
};