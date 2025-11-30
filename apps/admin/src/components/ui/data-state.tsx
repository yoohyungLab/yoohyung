import React from 'react';
import { LoadingState } from './loading-state';
import { ErrorState } from './error-state';
import { EmptyState } from './empty-state';

interface DataStateProps {
	loading?: boolean;
	error?: string | null;
	data: unknown[];
	onRetry?: () => void;
	children: React.ReactNode;
	loadingMessage?: string;
	errorTitle?: string;
	errorMessage?: string;
	emptyTitle?: string;
	emptyMessage?: string;
	emptyIcon?: React.ReactNode;
	emptyAction?: React.ReactNode;
}

export function DataState({
	loading = false,
	error = null,
	data = [],
	onRetry,
	children,
	loadingMessage = '데이터를 불러오는 중...',
	errorTitle = '오류가 발생했습니다',
	errorMessage,
	emptyTitle = '데이터가 없습니다',
	emptyMessage,
	emptyIcon = '📭',
	emptyAction,
}: DataStateProps) {
	if (loading && data.length === 0) {
		return <LoadingState message={loadingMessage} />;
	}

	if (error) {
		return <ErrorState title={errorTitle} message={errorMessage || error} onRetry={onRetry} />;
	}

	if (data.length === 0) {
		return <EmptyState title={emptyTitle} message={emptyMessage} icon={emptyIcon} action={emptyAction} />;
	}

	return <>{children}</>;
}
