import { Alert } from '../ui/Alert';

interface ErrorMessageProps {
    title?: string;
    message: string;
    onDismiss?: () => void;
    variant?: 'inline' | 'banner' | 'toast';
}

export const ErrorMessage = ({
    title = 'Something went wrong',
    message,
    onDismiss,
    variant = 'inline'
}: ErrorMessageProps) => {
    if (variant === 'banner') {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-red-800">{title}</h4>
                        <p className="text-sm text-red-700">{message}</p>
                    </div>
                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="text-red-500 hover:text-red-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (variant === 'toast') {
        return (
            <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
                <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">{title}</p>
                            <p className="text-sm text-red-700">{message}</p>
                        </div>
                        {onDismiss && (
                            <button
                                onClick={onDismiss}
                                className="text-red-500 hover:text-red-700"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Alert
            type="error"
            title={title}
            message={message}
            onDismiss={onDismiss}
        />
    );
};