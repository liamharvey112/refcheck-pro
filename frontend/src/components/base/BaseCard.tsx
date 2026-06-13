import type { ReactNode } from "react";

export interface BaseCardProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    hoverable?: boolean;
}

export const BaseCard = ({ children, onClick, className = '', hoverable = true }: BaseCardProps)  => {
    return (
        <div
            onClick={onClick}
            className={`
                bg-white border border-gray-200 round-lg p-4
                ${hoverable ? 'hover:shadow-md cursor-pointer transition-shadow' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
};