import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from './input';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onClear?: () => void;
    showClear?: boolean;
    containerClassName?: string;
    icon?: 'search' | 'none';
}

export function SearchInput({
    className,
    onClear,
    showClear = true,
    value,
    containerClassName,
    placeholder = '검색',
    icon = 'search',
    ...props
}: SearchInputProps) {
    const hasValue = value && value.toString().length > 0;

    if (icon === 'search') {
        return (
            <div className={cn('relative', containerClassName)}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={value}
                    className={cn(showClear && hasValue && 'pr-9', className, 'pl-10')}
                    placeholder={placeholder}
                    {...props}
                />
                {showClear && hasValue && onClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        );
    }

    return <Input value={value} className={className} placeholder={placeholder} {...props} />;
}
