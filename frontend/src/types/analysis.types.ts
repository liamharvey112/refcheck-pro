export interface Analysis {
    id: string;
    jobDescription: string;
    resumeText: string;
    linkedInProfile: string;
    resumeFileName: string;
    inconsistencies: string[];
    questions: string[];
    missingSkills: string[];
    risk: string;
    createdAt: string;
}