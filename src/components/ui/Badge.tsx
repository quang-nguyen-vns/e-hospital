import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    color?: 'red' | 'blue' | 'emerald' | 'amber' | 'purple' | 'slate' | 'teal' | 'indigo' | 'green';
    size?: 'sm' | 'md';
    variant?: 'solid' | 'subtle' | 'outline';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className = '', color = 'slate', size = 'md', variant = 'subtle', children, ...props }, ref) => {
        let colorStyles = '';

        switch (variant) {
            case 'solid':
                colorStyles = `bg-${color}-500 text-white`;
                break;
            case 'subtle':
                colorStyles = `bg-${color}-100 text-${color}-700`;
                if (color === 'red') colorStyles = 'bg-red-100 text-red-700';
                if (color === 'blue') colorStyles = 'bg-blue-100 text-blue-700';
                if (color === 'emerald') colorStyles = 'bg-emerald-100 text-emerald-700';
                if (color === 'amber') colorStyles = 'bg-amber-100 text-amber-700';
                if (color === 'purple') colorStyles = 'bg-purple-100 text-purple-700';
                if (color === 'slate') colorStyles = 'bg-slate-100 text-slate-700';
                if (color === 'teal') colorStyles = 'bg-teal-100 text-teal-700';
                if (color === 'indigo') colorStyles = 'bg-indigo-100 text-indigo-700';
                if (color === 'green') colorStyles = 'bg-green-100 text-green-700';
                break;
            case 'outline':
                colorStyles = `bg-transparent border border-${color}-300 text-${color}-700`;
                if (color === 'red') colorStyles = 'bg-transparent border border-red-300 text-red-700';
                if (color === 'blue') colorStyles = 'bg-transparent border border-blue-300 text-blue-700';
                if (color === 'emerald') colorStyles = 'bg-transparent border border-emerald-300 text-emerald-700';
                if (color === 'amber') colorStyles = 'bg-transparent border border-amber-300 text-amber-700';
                if (color === 'purple') colorStyles = 'bg-transparent border border-purple-300 text-purple-700';
                if (color === 'slate') colorStyles = 'bg-transparent border border-slate-300 text-slate-700';
                if (color === 'teal') colorStyles = 'bg-transparent border border-teal-300 text-teal-700';
                if (color === 'indigo') colorStyles = 'bg-transparent border border-indigo-300 text-indigo-700';
                if (color === 'green') colorStyles = 'bg-transparent border border-green-300 text-green-700';
                break;
        }

        const sizeStyles = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';

        return (
            <span
                ref={ref}
                className={`inline-flex items-center font-bold uppercase tracking-wider rounded ${sizeStyles} ${colorStyles} ${className}`}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';
