import React from 'react';
import { cn } from '../lib/utils';

interface ProgressBarProps {
	value: number; // 0-100 사이의 값
	max?: number; // 최대값 (기본값: 100)
	className?: string;
	barClassName?: string;
	showPercentage?: boolean;
	size?: 'sm' | 'md' | 'lg';
	variant?: 'default' | 'gradient' | 'success' | 'warning' | 'error';
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
	({ value, max = 100, className, barClassName, showPercentage = false, size = 'md', variant = 'default' }, ref) => {
		const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

		const sizeClasses = {
			sm: 'h-1',
			md: 'h-2',
			lg: 'h-3',
		};

		const variantClasses = {
			default: 'bg-gray-200',
			gradient: 'bg-gradient-to-r from-sky-400 to-rose-300',
			success: 'bg-green-500',
			warning: 'bg-yellow-500',
			error: 'bg-red-500',
		};

		const barVariantClasses = {
			default: 'bg-blue-500',
			gradient: 'bg-gradient-to-r from-sky-400 to-rose-300',
			success: 'bg-green-500',
			warning: 'bg-yellow-500',
			error: 'bg-red-500',
		};

		return (
			<div className={cn('w-full', className)} ref={ref}>
				<div
					className={cn(
						'w-full rounded-full overflow-hidden',
						sizeClasses[size],
						variant === 'default' ? variantClasses.default : 'bg-gray-200'
					)}
				>
					<div
						className={cn('h-full transition-all duration-300 ease-in-out', barVariantClasses[variant], barClassName)}
						style={{ width: `${percentage}%` }}
					/>
				</div>
				{showPercentage && <div className="text-xs text-gray-500 mt-1 text-right">{Math.round(percentage)}%</div>}
			</div>
		);
	}
);

ProgressBar.displayName = 'ProgressBar';
