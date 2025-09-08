import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const alertVariants = cva(
    'relative w-full rounded-2xl border-2 px-6 py-4 text-sm shadow-lg [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-6 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-8 transition-all duration-200',
    {
        variants: {
            variant: {
                default: 'bg-white/80 backdrop-blur-sm border-gray-200 text-gray-900',
                destructive: 'bg-red-50/80 backdrop-blur-sm border-red-200 text-red-800 [&>svg]:text-red-600',
                success: 'bg-green-50/80 backdrop-blur-sm border-green-200 text-green-800 [&>svg]:text-green-600',
                warning: 'bg-yellow-50/80 backdrop-blur-sm border-yellow-200 text-yellow-800 [&>svg]:text-yellow-600',
                info: 'bg-blue-50/80 backdrop-blur-sm border-blue-200 text-blue-800 [&>svg]:text-blue-600',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>>(
    ({ className, variant, ...props }, ref) => (
        <div ref={ref} role="alert" className={`${alertVariants({ variant })} ${className || ''}`} {...props} />
    )
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h5 ref={ref} className={`mb-2 font-bold leading-tight tracking-tight ${className || ''}`} {...props} />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={`text-sm leading-relaxed [&_p]:leading-relaxed ${className || ''}`} {...props} />
    )
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
