import * as React from 'react';
import { Textarea } from './textarea';
import { cn } from '../../lib/utils';

export interface DefaultTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    required?: boolean;
    error?: string;
    helperText?: string;
}

export function DefaultTextarea({ className, label, required, error, helperText, id, ...props }: DefaultTextareaProps) {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={textareaId} className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <Textarea
                id={textareaId}
                className={cn(error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)}
                {...props}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
        </div>
    );
}
