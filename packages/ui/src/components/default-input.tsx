import * as React from 'react';
import { Input } from './input';
import { Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface DefaultInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: 'search' | 'none';
    onClear?: () => void;
    showClear?: boolean;
}

export function DefaultInput({ className, icon = 'none', onClear, showClear, value, ...props }: DefaultInputProps) {
    const hasValue = value && value.toString().length > 0;

    if (icon === 'search') {
        return (
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={value} className={cn('pl-9', showClear && hasValue && 'pr-9', className)} {...props} />
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

    return <Input value={value} className={className} {...props} />;
}
