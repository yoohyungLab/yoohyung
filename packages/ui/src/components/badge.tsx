import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@pickid/shared';

const badgeVariants = cva(
	'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
				secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
				outline: 'text-foreground border-input',
				success: 'border-transparent bg-green-100 text-green-800 hover:bg-green-100/80',
				warning: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80',
				info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100/80',
				// 섹션용 variants
				popular: 'border-transparent bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-sm',
				new: 'border-transparent bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-sm',
				recommended: 'border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold shadow-sm',
				trending: 'border-transparent bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold shadow-sm',
				hot: 'border-transparent bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-sm',
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
