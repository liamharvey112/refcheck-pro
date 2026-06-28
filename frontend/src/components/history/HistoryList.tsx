import { Card } from '../ui/Card';
import { HistoryCard } from './HistoryCard';
import { type Analysis } from '../../types/analysis.types';

interface HistoryListProps {
    analyses: Analysis[];
    onSelect: (analysis: Analysis) => void;
}

export const HistoryList = ({ analyses, onSelect }: HistoryListProps) => {
    if (analyses.length === 0) {
        return (
            <Card>
                <p className="text-gray-500 text-center py-8">
                    No analyses yet. Go to the Analyse page to get started.
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {analyses.map((analysis) => (
                <HistoryCard
                    key={analysis.id}
                    id={analysis.id}
                    jobDescription={analysis.jobDescription}
                    risk={analysis.risk}
                    createdAt={analysis.createdAt}
                    resumeFileName={analysis.resumeFileName}
                    onClick={() => onSelect(analysis)}
                />
            ))}
        </div>
    );
};