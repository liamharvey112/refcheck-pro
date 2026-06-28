import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    hoverable?: boolean;
    title?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    variant?: 'default' | 'bordered' | 'shadow';
}

const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
};

const variantClasses = {
    default: 'bg-white',
    bordered: 'bg-white border border-gray-200',
    shadow: 'bg-white border border-gray-200 shadow-lg'
};

export const Card = ({
    children,
    onClick,
    className = '',
    hoverable = true,
    title,
    padding = 'md',
    variant = 'bordered'
}: CardProps) => {
    return (
        <div
            onClick={onClick}
            className={`
                ${variantClasses[variant]}
                rounded-lg
                ${hoverable ? 'hover:shadow-md cursor-pointer transition-shadow' : ''}
                ${className}
            `}
        >
            {title && (
                <div className={`border-b border-gray-200 ${paddingClasses[padding]}`}>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
            )}
            <div className={paddingClasses[padding]}>{children}</div>
        </div>
    );
};