import React from 'react';
import { cn } from '@pickid/shared';

interface LoadingStateProps {
	message?: string;
	className?: string;
	size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = '로딩 중...', className, size = 'md' }: LoadingStateProps) {
	const sizeClasses = {
		sm: 'h-6 w-6',
		md: 'h-8 w-8',
		lg: 'h-12 w-12',
	};

	return (
		<div className={cn('flex items-center justify-center h-64', className)}>
			<div className="text-center">
				<div
					className={cn('animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-4', sizeClasses[size])}
				></div>
				<span className="text-gray-600">{message}</span>
			</div>
		</div>
	);
}
