import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '../lib/utils';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface DefaultSelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'outline' | 'ghost';
}

const sizeClasses = {
    sm: 'h-8 text-xs px-2',
    md: 'h-10 text-sm px-3',
    lg: 'h-12 text-base px-4',
};

const variantClasses = {
    default: 'border-slate-200 bg-white hover:bg-slate-50',
    outline: 'border-2 border-slate-300 bg-white hover:border-slate-400',
    ghost: 'border-transparent bg-transparent hover:bg-slate-100',
};

export const DefaultSelect = React.forwardRef<HTMLButtonElement, DefaultSelectProps>(
    ({ value, onValueChange, options, placeholder = '선택하세요', disabled, className, size = 'md', variant = 'default' }, ref) => {
        return (
            <Select value={value} onValueChange={onValueChange} disabled={disabled}>
                <SelectTrigger
                    ref={ref}
                    className={cn(
                        sizeClasses[size],
                        variantClasses[variant],
                        'transition-colors duration-200',
                        disabled && 'cursor-not-allowed opacity-50',
                        className
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5} className="z-50">
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }
);

DefaultSelect.displayName = 'DefaultSelect';
