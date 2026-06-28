import type { ReactNode } from 'react';

interface PageLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
}

const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full'
};

const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
};

export const PageLayout = ({
    children,
    title,
    subtitle,
    actions,
    maxWidth = 'lg',
    padding = 'md',
    className = ''
}: PageLayoutProps) => {
    return (
        <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${className}`}>
            {(title || actions) && (
                <div className="flex justify-between items-start mb-6">
                    <div>
                        {title && <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>}
                        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
                    </div>
                    {actions && <div>{actions}</div>}
                </div>
            )}
            {children}
        </div>
    );
};