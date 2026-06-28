import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate, truncateText, getRiskColor } from '../../utils/formatters';

interface HistoryCardProps {
    id: string;
    jobDescription: string;
    risk: string;
    createdAt: string;
    resumeFileName: string | null;
    onClick: () => void;
}

export const HistoryCard = ({ jobDescription, risk, createdAt, resumeFileName, onClick }: HistoryCardProps) => {
    return (
        <Card onClick={onClick} hoverable>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{formatDate(createdAt)}</p>
                    <p className="font-medium text-gray-900">{truncateText(jobDescription, 100)}</p>
                    {resumeFileName && (
                        <p className="text-sm text-gray-500 mt-1">Resume: {resumeFileName}</p>
                    )}
                </div>
                <Badge variant={getRiskColor(risk)}>{risk} Risk</Badge>
            </div>
        </Card>
    );
};