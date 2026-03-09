import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', icon, ...props }, ref) => {

        const IconWrapper = icon ? (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                {icon}
            </div>
        ) : null;

        const inputPadding = icon ? 'pl-10 pr-4 py-2' : 'px-4 py-2';

        return (
            <div className="relative w-full">
                {IconWrapper}
                <input
                    ref={ref}
                    className={`w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-50 ${inputPadding} ${className}`}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = 'Input';
