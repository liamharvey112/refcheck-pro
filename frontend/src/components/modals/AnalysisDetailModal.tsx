import { BaseModal } from '../base/BaseModal';
import type { Analysis } from '../../types/analysis.types';

interface AnalysisDetailModalProps {
    analysis: Analysis | null;
    onClose: () => void;
}

const getRiskColor = (risk: string) => {
    switch (risk) {
        case 'Low': return 'bg-green-100 text-green-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'High': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export const AnalysisDetailModal = ({ analysis, onClose }: AnalysisDetailModalProps) => {
    if (!analysis) return null;

    return (
        <BaseModal isOpen={!!analysis} onClose={onClose} title="Analysis Details" size="lg">
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
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-sm font-medium ${getRiskColor(analysis.risk)}`}>
                        {analysis.risk} Risk
                    </span>
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
                                <span key={i} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                                    {skill}
                                </span>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};