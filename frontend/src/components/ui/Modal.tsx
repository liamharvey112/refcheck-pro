import { type ReactNode, useEffect } from 'react';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showActions?: boolean;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmLoading?: boolean;
}

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
};

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'lg',
    showActions = false,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmLoading = false
}: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
            <div className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto m-4`}>
                {title && (
                    <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                <div className="p-6">{children}</div>
                {showActions && (
                    <div className="flex justify-end gap-3 p-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            {cancelText}
                        </Button>
                        <Button onClick={onConfirm} loading={confirmLoading}>
                            {confirmText}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};