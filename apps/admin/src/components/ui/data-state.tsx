import React from 'react';
import { ErrorState } from './error-state';
import { LoadingState } from './loading-state';

interface DataStateProps {
	loading?: boolean;
	error?: string | null;
	data: unknown[];
	onRetry?: () => void;
	children: React.ReactNode;
	loadingMessage?: string;
	errorTitle?: string;
	errorMessage?: string;
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
}: DataStateProps) {
	if (loading && data.length === 0) {
		return <LoadingState message={loadingMessage} />;
	}

	if (error) {
		return <ErrorState title={errorTitle} message={errorMessage || error} onRetry={onRetry} />;
	}

	return <>{children}</>;
}
