import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { getRiskColor } from '../../utils/formatters';
import { type Analysis } from '../../types/analysis.types';

interface AnalysisDetailModalProps {
    analysis: Analysis | null;
    onClose: () => void;
}

export const AnalysisDetailModal = ({ analysis, onClose }: AnalysisDetailModalProps) => {
    if (!analysis) {
        return null;
    }
    
    return (
        <Modal isOpen={!!analysis} onClose={onClose} title="Analysis Details" size="lg">
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-900">Job Description</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{analysis.jobDescription}</p>
                </div>
                {analysis.resumeFileName && (
                    <div>
                        <h4 className="font-semibold text-gray-900">Resume File</h4>
                        <p className="text-gray-700">{analysis.resumeFileName}</p>
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-gray-900">Risk Assessment</h4>
                    <Badge variant={getRiskColor(analysis.risk)} className="mt-1">
                        {analysis.risk} Risk
                    </Badge>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">Inconsistencies Found</h4>
                    {analysis.inconsistencies.length === 0 ? (
                        <p className="text-gray-500">No inconsistencies found</p>
                    ) : (
                        <ul className="list-disc pl-5 space-y-1">
                            {analysis.inconsistencies.map((item, i) => (
                                <li key={i} className="text-red-600">{item}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">Questions to Ask</h4>
                    {analysis.questions.length === 0 ? (
                        <p className="text-gray-500">No suggested questions</p>
                    ) : (
                        <ul className="list-decimal pl-5 space-y-2">
                            {analysis.questions.map((item, i) => (
                                <li key={i} className="text-gray-700">{item}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">Missing Skills</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {analysis.missingSkills.length === 0 ? (
                            <p className="text-gray-500">No missing skills identified</p>
                        ) : (
                            analysis.missingSkills.map((skill, i) => (
                                <Badge key={i} variant="warning">{skill}</Badge>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};