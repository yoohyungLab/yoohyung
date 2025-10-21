import { useRouter } from 'next/navigation';
import { ErrorMessage } from '@pickid/ui';
import { Loading } from '@/shared/components/loading';
import type { TErrorType } from '@pickid/ui';
import { ReactElement } from 'react';

interface UseErrorHandlingOptions {
	context?: 'test' | 'feedback' | 'result' | 'general';
	onRetry?: () => void;
	onGoHome?: () => void;
	onGoBack?: () => void;
	redirectToNotFound?: boolean;
}

interface UseErrorHandlingReturn {
	renderError: (error: Error | string | null, errorType?: TErrorType) => ReactElement | null;
	renderLoading: (variant?: 'default' | 'test' | 'result') => ReactElement;
	renderNotFound: (message?: string) => ReactElement | null;
	handleError: (error: Error | string | null, errorType?: TErrorType) => void;
}

/**
 * 통합된 에러 처리 훅
 */
export function useErrorHandling(options: UseErrorHandlingOptions = {}): UseErrorHandlingReturn {
	const router = useRouter();
	const { context = 'general', onRetry, onGoHome, onGoBack, redirectToNotFound = true } = options;

	// 컨텍스트별 에러 설정
	const getContextualConfig = (errorType: TErrorType) => {
		const configs = {
			test: {
				not_found: {
					title: '테스트를 찾을 수 없어요',
					message: '요청하신 테스트가 존재하지 않거나 삭제되었습니다',
				},
				server: {
					title: '테스트를 불러올 수 없어요',
					message: '테스트 데이터를 가져오는 중 문제가 발생했습니다',
				},
				network: {
					title: '연결 문제가 발생했어요',
					message: '인터넷 연결을 확인하고 잠시 후 다시 시도해주세요',
				},
			},
			feedback: {
				not_found: {
					title: '피드백을 찾을 수 없어요',
					message: '요청하신 피드백이 존재하지 않습니다',
				},
				server: {
					title: '피드백을 불러올 수 없어요',
					message: '피드백 데이터를 가져오는 중 문제가 발생했습니다',
				},
			},
			result: {
				not_found: {
					title: '결과를 찾을 수 없어요',
					message: '요청하신 결과가 존재하지 않습니다',
				},
				server: {
					title: '결과를 불러올 수 없어요',
					message: '결과 데이터를 가져오는 중 문제가 발생했습니다',
				},
			},
			general: {
				not_found: {
					title: '페이지를 찾을 수 없어요',
					message: '요청하신 페이지가 존재하지 않습니다',
				},
				server: {
					title: '문제가 발생했어요',
					message: '요청을 처리하는 중 문제가 발생했습니다',
				},
			},
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const contextConfig = configs[context] as any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const generalConfig = configs.general as any;
		return contextConfig[errorType] || generalConfig[errorType] || configs.general.server;
	};

	// 에러 렌더링
	const renderError = (error: Error | string | null, errorType?: TErrorType): ReactElement | null => {
		if (!error) return null;

		const detectedType = errorType || 'server';
		const config = getContextualConfig(detectedType);

		return (
			<ErrorMessage
				error={error}
				errorType={detectedType}
				title={config.title}
				message={config.message}
				variant="page"
				onRetry={onRetry}
				onGoHome={onGoHome}
				onGoBack={onGoBack}
			/>
		);
	};

	// 로딩 렌더링
	const renderLoading = (variant: 'default' | 'test' | 'result' = 'default'): ReactElement => {
		return <Loading variant={variant} />;
	};

	// 404 렌더링
	const renderNotFound = (message?: string): ReactElement | null => {
		const config = getContextualConfig('not_found');

		return (
			<ErrorMessage
				title={config.title}
				message={message || config.message}
				errorType="not_found"
				variant="page"
				onGoHome={onGoHome}
				onGoBack={onGoBack}
			/>
		);
	};

	// 에러 처리 (리다이렉트)
	const handleError = (error: Error | string | null, errorType?: TErrorType): void => {
		if (!redirectToNotFound) return;

		const detectedType = errorType || 'server';
		const errorMessage = error instanceof Error ? error.message : String(error);

		if (detectedType === 'not_found') {
			router.push('/not-found');
		} else {
			router.push(`/not-found?error=${detectedType}&message=${encodeURIComponent(errorMessage)}`);
		}
	};

	return {
		renderError,
		renderLoading,
		renderNotFound,
		handleError,
	};
}

/**
 * 간단한 에러 처리 훅 (리다이렉트만)
 */
export function useSimpleErrorHandling() {
	const router = useRouter();

	const handleError = (error: Error | string | null, errorType: TErrorType = 'server') => {
		const errorMessage = error instanceof Error ? error.message : String(error);
		router.push(`/not-found?error=${errorType}&message=${encodeURIComponent(errorMessage)}`);
	};

	const handleNotFound = () => {
		router.push('/not-found');
	};

	return { handleError, handleNotFound };
}
