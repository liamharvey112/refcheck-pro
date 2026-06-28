export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
}

export interface Analysis {
    id: string;
    userId: string;
    jobDescription: string;
    resumeText: string;
    linkedInProfile: string | null;
    resumeFileName: string | null;
    inconsistencies: string[];
    questions: string[];
    missingSkills: string[];
    risk: 'Low' | 'Medium' | 'High';
    createdAt: string;
}

export interface AnalysisResult {
    id: string;
    inconsistencies: string[];
    questions: string[];
    missingSkills: string[];
    risk: 'Low' | 'Medium' | 'High';
}

export interface ApiError {
    message: string;
    statusCode: number;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';