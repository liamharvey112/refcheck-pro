import { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { PageLayout } from '../components/layout/PageLayout';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { HistoryList } from '../components/history/HistoryList';
import { AnalysisDetailModal } from '../components/modals/AnalysisDetailModal';
import { type Analysis } from '../types/analysis.types';

export const HistoryView = () => {
    const { analyses, loading, error } = useHistory();
    const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

    if (loading) {
        return (
            <PageLayout title="Analysis History">
                <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                </div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout title="Analysis History">
                <Alert type="error" message={error} />
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Analysis History">
            <HistoryList analyses={analyses} onSelect={setSelectedAnalysis} />
            <AnalysisDetailModal analysis={selectedAnalysis} onClose={() => setSelectedAnalysis(null)} />
        </PageLayout>
    );
};