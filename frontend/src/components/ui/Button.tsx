import type { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    className?: string;
}

const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
};

const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg'
};

export const Button = ({
    children,
    onClick,
    disabled = false,
    loading = false,
    type = 'button',
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = ''
}: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${fullWidth ? 'w-full' : ''}
                transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                </div>
            ) : children}
        </button>
    );
};