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
	// 커스터마이징 옵션들
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
	// 로딩 상태
	if (loading && data.length === 0) {
		return <LoadingState message={loadingMessage} />;
	}

	// 에러 상태
	if (error) {
		return <ErrorState title={errorTitle} message={errorMessage || error} onRetry={onRetry} />;
	}

	// 데이터가 없는 상태
	if (data.length === 0) {
		return <EmptyState title={emptyTitle} message={emptyMessage} icon={emptyIcon} action={emptyAction} />;
	}

	// 정상 상태 - children 렌더링
	return <>{children}</>;
}
