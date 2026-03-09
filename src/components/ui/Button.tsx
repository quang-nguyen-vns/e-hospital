import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {

        let variantStyles = '';
        switch (variant) {
            case 'primary':
                variantStyles = 'bg-generali-red hover:bg-generali-red-dark text-white shadow-sm';
                break;
            case 'secondary':
                variantStyles = 'bg-slate-100 hover:bg-slate-200 text-slate-800';
                break;
            case 'outline':
                variantStyles = 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300';
                break;
            case 'ghost':
                variantStyles = 'bg-transparent hover:bg-slate-100 text-slate-700';
                break;
        }

        let sizeStyles = '';
        switch (size) {
            case 'sm':
                sizeStyles = 'py-1.5 px-3 text-sm';
                break;
            case 'md':
                sizeStyles = 'py-2 px-4';
                break;
            case 'lg':
                sizeStyles = 'py-3 px-6 text-lg';
                break;
        }

        const widthClass = fullWidth ? 'w-full' : '';

        return (
            <button
                ref={ref}
                className={`font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${variantStyles} ${sizeStyles} ${widthClass} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
