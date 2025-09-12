import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

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
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
};

const variantClasses = {
    default: 'border-input bg-background',
    outline: 'border-2 border-gray-300 bg-white',
    ghost: 'border-transparent bg-transparent',
};

export const DefaultSelect = React.forwardRef<HTMLButtonElement, DefaultSelectProps>(
    ({ value, onValueChange, options, placeholder = '선택하세요', disabled, className, size = 'md', variant = 'default' }, ref) => {
        return (
            <Select value={value} onValueChange={onValueChange} disabled={disabled}>
                <SelectTrigger ref={ref} className={`${sizeClasses[size]} ${variantClasses[variant]} ${className || ''}`}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
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
