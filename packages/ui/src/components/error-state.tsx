import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from './button';
import { cn } from '../lib/utils';

interface ErrorStateProps {
	title?: string;
	message?: string;
	actionLabel?: string;
	onAction?: () => void;
	className?: string;
}

export function ErrorState({
	title = '오류가 발생했습니다',
	message = '요청을 처리하는 중 문제가 발생했습니다.',
	actionLabel = '다시 시도',
	onAction,
	className,
}: ErrorStateProps) {
	return (
		<div className={cn('text-center py-12', className)}>
			<AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
			<p className="text-gray-600 mb-4">{message}</p>
			{onAction && (
				<Button onClick={onAction} variant="outline">
					<ArrowLeft className="w-4 h-4 mr-2" />
					{actionLabel}
				</Button>
			)}
		</div>
	);
}
