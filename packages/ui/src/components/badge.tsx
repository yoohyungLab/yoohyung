import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@pickid/shared';

const badgeVariants = cva(
	'inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground',
				secondary: 'border-transparent bg-secondary text-secondary-foreground',
				destructive: 'border-transparent bg-destructive text-destructive-foreground',
				outline: 'text-foreground border-input',
				success: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
				warning: 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
				info: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
				popular: 'border-transparent bg-gradient-to-r from-red-500 to-pink-500 text-white',
				new: 'border-transparent bg-gradient-to-r from-green-500 to-emerald-500 text-white',
				recommended: 'border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
				trending: 'border-transparent bg-gradient-to-r from-purple-500 to-violet-500 text-white',
				hot: 'border-transparent bg-gradient-to-r from-orange-500 to-red-500 text-white',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
	children?: React.ReactNode;
	className?: string;
}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
