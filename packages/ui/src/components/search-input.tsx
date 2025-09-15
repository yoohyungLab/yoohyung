import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onClear?: () => void;
    showClear?: boolean;
    containerClassName?: string;
}

export function SearchInput({
    className,
    onClear,
    showClear = true,
    value,
    containerClassName,
    placeholder = '검색',
    ...props
}: SearchInputProps) {
    const hasValue = value && value.toString().length > 0;

    return (
        <div className={cn('relative', containerClassName)}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                className={cn(
                    'h-10text-sm w-full pl-10 pr-4 py-4 border border-slate-200 rounded-md',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'transition-colors duration-200',
                    showClear && hasValue && 'pr-10',
                    className
                )}
                {...props}
            />
            {showClear && hasValue && onClear && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
