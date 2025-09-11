'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

const Alert = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: 'default' | 'destructive';
    }
>(({ className, variant = 'default', ...props }, ref) => (
    <div
        ref={ref}
        role="alert"
        className={cn(
            'relative w-full rounded-lg border p-4',
            {
                'border-blue-200 bg-blue-50 text-blue-800': variant === 'default',
                'border-red-200 bg-red-50 text-red-800': variant === 'destructive',
            },
            className
        )}
        {...props}
    />
));

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
));

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
);

Alert.displayName = 'Alert';
AlertTitle.displayName = 'AlertTitle';
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
