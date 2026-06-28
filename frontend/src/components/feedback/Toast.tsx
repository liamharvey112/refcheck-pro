import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose?: () => void;
}

const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
};

export const Toast = ({ message, type = 'info', duration = 5000, onClose }: ToastProps) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
            <div className={`border rounded-lg shadow-lg p-4 ${typeClasses[type]}`}>
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );
};