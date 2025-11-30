import React from 'react';
import { Card, CardContent, CardHeader } from '@pickid/ui';
import { cn } from '@pickid/shared';

interface AdminCardProps {
	children: React.ReactNode;
	className?: string;
	variant?:
		| 'default'
		| 'outline'
		| 'elevated'
		| 'bordered'
		| 'gradient'
		| 'step'
		| 'action'
		| 'modal'
		| 'info'
		| 'warning'
		| 'success';
	padding?: 'none' | 'sm' | 'md' | 'lg';
	shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
	rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

interface AdminCardHeaderProps {
	children?: React.ReactNode;
	className?: string;
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
	action?: React.ReactNode;
	icon?: React.ReactNode;
	variant?: 'default' | 'gradient' | 'step' | 'modal';
}

interface AdminCardContentProps {
	children: React.ReactNode;
	className?: string;
}

// 메인 Card 컴포넌트
export function AdminCard({
	children,
	className,
	variant = 'default',
	padding = 'none',
	shadow = 'md',
	rounded = 'lg',
}: AdminCardProps) {
	const variantClasses = {
		default: 'bg-white border border-neutral-200',
		outline: 'bg-white border-2 border-neutral-300',
		elevated: 'bg-white shadow-sm border border-neutral-200',
		bordered: 'bg-white border-l-4 border-l-neutral-600 border border-neutral-200',
		gradient: 'bg-neutral-50 border border-neutral-200',
		step: 'bg-white shadow-sm border border-neutral-200 rounded-xl overflow-hidden',
		action: 'bg-white rounded-xl shadow-sm border border-neutral-200',
		modal: 'bg-white border border-neutral-200 shadow-sm',
		info: 'bg-neutral-50 border border-neutral-200 shadow-sm',
		warning: 'bg-neutral-50 border border-neutral-200 shadow-sm',
		success: 'bg-neutral-50 border border-neutral-200 shadow-sm',
	};

	const paddingClasses = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8',
	};

	const shadowClasses = {
		none: '',
		sm: 'shadow-sm',
		md: 'shadow-md',
		lg: 'shadow-lg',
		xl: 'shadow-xl',
	};

	const roundedClasses = {
		none: '',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		'2xl': 'rounded-2xl',
	};

	return (
		<Card
			className={cn(
				'transition-all duration-200',
				variantClasses[variant],
				paddingClasses[padding],
				shadowClasses[shadow],
				roundedClasses[rounded],
				className
			)}
		>
			{children}
		</Card>
	);
}

// Card Header 컴포넌트
export function AdminCardHeader({
	children,
	className,
	title,
	subtitle,
	action,
	icon,
	variant = 'default',
}: AdminCardHeaderProps) {
	const variantClasses = {
		default: 'border-b border-neutral-200 pb-3 mb-4',
		gradient: 'bg-neutral-50 border-b border-neutral-200 pb-3 mb-4 -mx-4 -mt-4 px-4 pt-4',
		step: 'bg-neutral-50 border-b border-neutral-200 pb-3 mb-4 -mx-6 -mt-6 px-6 pt-4',
		modal: 'pb-3 mb-4',
	};

	return (
		<CardHeader className={cn('p-0', variantClasses[variant], className)}>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{icon && <div className="text-neutral-600">{icon}</div>}
					<div>
						{title && <div className="text-lg font-bold text-neutral-900">{title}</div>}
						{subtitle && <div className="text-neutral-600 text-sm mt-1">{subtitle}</div>}
					</div>
				</div>
				{action && <div className="flex-shrink-0">{action}</div>}
			</div>
			{children}
		</CardHeader>
	);
}

// Card Content 컴포넌트
export function AdminCardContent({ children, className }: AdminCardContentProps) {
	return <CardContent className={cn('p-0', className)}>{children}</CardContent>;
}

// 기본 export
export default AdminCard;
