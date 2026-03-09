import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', noPadding = false, children, ...props }, ref) => {
        const paddingClass = noPadding ? '' : 'p-6';
        return (
            <div
                ref={ref}
                className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${paddingClass} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
