import { HistoryCard } from "../cards/HistoryCard";
import type { Analysis } from "../../types/analysis.types";

interface HistoryListProps {
    analyses: Analysis[];
    onSelect: (analysis: Analysis) => void;
}

export const HistoryList = ({ analyses, onSelect }: HistoryListProps) => {
    if (analyses.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No analyses yet. Go to the home page to analyze a candidate.</p>
            </div>
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
}