export const validators = {
    jobDescription: (value: string): string | null => {
        if (!value || value.trim().length === 0) {
            return 'Job description is required';
        }

        if (value.trim().length < 20) {
            return 'Job description should be at least 20 characters';
        }

        return null;
    },
    resumeText: (value: string): string | null => {
        if (!value || value.trim().length === 0) {
            return 'Resume text is required';
        }
        
        if (value.trim().length < 50) {
            return 'Resume should be at least 50 characters';
        }
        
        return null;
    }
};