import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground shadow ',
                destructive: 'bg-destructive text-destructive-foreground shadow-sm ',
                outline: 'border border-input bg-background shadow-sm ',
                secondary: 'bg-secondary text-secondary-foreground shadow-sm ',
                ghost: 'hover:bg-accent ',
                link: 'text-primary underline-offset-4 ',
                gradient: 'bg-gradient-to-r from-blue-400 to-pink-400 text-white ',
                glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white ',
                kakao: 'bg-[#FEE500] hover:bg-[#FEE500] text-black font-medium border-0 shadow-sm ',
                success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm ',
                warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm ',
                icon: 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 shadow-sm ',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 rounded-md px-3 text-xs',
                lg: 'h-10 rounded-md px-8',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={buttonVariants({ variant, size, className })} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
