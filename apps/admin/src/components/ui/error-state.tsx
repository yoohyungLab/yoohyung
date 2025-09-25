import React from 'react';
import { Button } from '@repo/ui';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

interface ErrorStateProps {
	title?: string;
	message?: string;
	onRetry?: () => void;
	retryLabel?: string;
	className?: string;
	showIcon?: boolean;
}

export function ErrorState({
	title = '오류가 발생했습니다',
	message,
	onRetry,
	retryLabel = '다시 시도',
	className,
	showIcon = true,
}: ErrorStateProps) {
	return (
		<div className={cn('space-y-6 p-5', className)}>
			<div className="text-center py-12">
				{showIcon && <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />}
				<div className="text-red-600 text-lg font-semibold mb-2">{title}</div>
				{message && <div className="text-gray-600 mb-4">{message}</div>}
				{onRetry && (
					<Button onClick={onRetry} variant="outline" className="inline-flex items-center gap-2">
						<RefreshCw className="w-4 h-4" />
						{retryLabel}
					</Button>
				)}
			</div>
		</div>
	);
}
