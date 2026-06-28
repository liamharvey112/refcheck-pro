import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';

interface ErrorFallbackProps {
    error: Error | null;
    resetErrorBoundary?: () => void;
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
            <Alert
                type="error"
                title="Something went wrong"
                message={error?.message || 'An unexpected error occurred'}
            />
            {resetErrorBoundary && (
                <Button variant="primary" onClick={resetErrorBoundary} className="mt-4">
                    Try again
                </Button>
            )}
        </div>
    );
};