import { BaseCard } from "../base/BaseCard";

interface HistoryCardProps {
    id: string;
    jobDescription: string;
    risk: string;
    createdAt: string;
    resumeFileName: string | null;
    onClick: () => void;
}

const getRiskColor = (risk: string) => {
    switch (risk) {
        case 'Low': return 'bg-green-100 text-green-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'High': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const HistoryCard = ({ jobDescription, risk, createdAt, resumeFileName, onClick }: HistoryCardProps) => {
    return (
        <BaseCard onClick={onClick} hoverable>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{formatDate(createdAt)}</p>
                    <p className="font-medium text-gray-900">
                        {truncateText(jobDescription, 100)}
                    </p>
                    {resumeFileName && (
                        <p className="text-sm text-gray-500 mt-1">
                            Resume: {resumeFileName}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk)}`}>
                        {risk} Risk
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </BaseCard>
    );
};