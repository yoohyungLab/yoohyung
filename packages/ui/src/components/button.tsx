import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@pickid/shared';

const buttonVariants = cva(
	'cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-blue-600 text-white shadow',
				destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
				gradient:
					'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg hover:from-pink-600 hover:to-blue-600',
				gradientSky:
					'bg-gradient-to-r from-sky-500 to-rose-400 text-white shadow-lg hover:from-sky-600 hover:to-rose-500',
				success: 'bg-green-500 text-white shadow hover:bg-green-600',
				warning: 'bg-yellow-500 text-white shadow hover:bg-yellow-600',
				error: 'bg-red-500 text-white shadow hover:bg-red-600',
				kakao: 'w-full bg-[#FEE500] text-[#191919] font-medium h-12 rounded-xl shadow-md',
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				xl: 'h-13 px-6 py-3 text-base',
				xxl: 'h-20 px-8 py-6 text-lg',
				icon: 'h-9 w-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
	loadingText?: string;
	text?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			loading = false,
			loadingText = '로딩 중...',
			text,
			children,
			disabled,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';
		const isDisabled = disabled || loading;
		const effectiveSize = variant === 'kakao' ? undefined : size;

		return (
			<Comp
				className={cn(buttonVariants({ variant, size: effectiveSize, className }))}
				ref={ref}
				disabled={isDisabled}
				{...props}
			>
				{loading ? (
					<>
						<Loader2 className="w-4 h-4 animate-spin" />
						{loadingText}
					</>
				) : (
					children ?? text
				)}
			</Comp>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
