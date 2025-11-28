import React from 'react';
import { cn } from '@pickid/ui';

interface EmptyStateProps {
	title?: string;
	message?: string;
	icon?: React.ReactNode;
	action?: React.ReactNode;
	className?: string;
}

export function EmptyState({ title = '데이터가 없습니다', message, icon = '📭', action, className }: EmptyStateProps) {
	return (
		<div className={cn('bg-white rounded-lg border overflow-hidden', className)}>
			<div className="p-12 text-center">
				<div className="text-gray-400 text-6xl mb-4">{icon}</div>
				<h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
				{message && <p className="text-gray-600 mb-4">{message}</p>}
				{action && <div className="mt-6">{action}</div>}
			</div>
		</div>
	);
}
