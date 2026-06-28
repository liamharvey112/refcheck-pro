import { type ReactNode, forwardRef } from 'react';

export interface BaseInputProps {
    id?: string;
    label?: string;
    error?: string | null;  
    required?: boolean;
    disabled?: boolean;
    helperText?: string;
    className?: string;
    children: ReactNode;
}

export const BaseInput = forwardRef<HTMLDivElement, BaseInputProps>(
    ({ id, label, error, required, disabled, helperText, className = '', children }, ref) => {
        return (
            <div ref={ref} className={`w-full ${className}`}>
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className={disabled ? 'opacity-50 cursor-not-allowed' : ''}>
                    {children}
                </div>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
            </div>
        );
    }
);

BaseInput.displayName = 'BaseInput';