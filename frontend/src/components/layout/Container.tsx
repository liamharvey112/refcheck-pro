import type { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full'
};

export const Container = ({ children, className = '', maxWidth = 'lg' }: ContainerProps) => {
    return (
        <div className={`mx-auto px-4 ${maxWidthClasses[maxWidth]} ${className}`}>
            {children}
        </div>
    )
}