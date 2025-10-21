'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ErrorMessage } from '@pickid/ui';
import type { TErrorType } from '@pickid/ui';

export default function NotFound() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	// 에러 파라미터가 있으면 에러 페이지로 처리
	const errorType = searchParams.get('error') as TErrorType;
	const errorMessage = searchParams.get('message');

	const handleGoHome = () => router.push('/');
	const handleGoBack = () => router.back();

	if (errorType) {
		return (
			<ErrorMessage
				error={errorMessage ? new Error(errorMessage) : null}
				errorType={errorType}
				variant="page"
				onGoHome={handleGoHome}
				onGoBack={handleGoBack}
			/>
		);
	}

	// 일반 404 페이지 - 경로별 컨텍스트 메시지
	const getContextualMessage = () => {
		if (pathname?.startsWith('/tests/')) {
			return {
				title: '테스트를 찾을 수 없어요',
				message: '요청하신 테스트가 존재하지 않거나 삭제되었습니다',
			};
		}
		if (pathname?.startsWith('/category/')) {
			return {
				title: '카테고리를 찾을 수 없어요',
				message: '요청하신 카테고리가 존재하지 않습니다',
			};
		}
		if (pathname?.startsWith('/popular/')) {
			return {
				title: '인기 테스트를 찾을 수 없어요',
				message: '요청하신 인기 테스트가 존재하지 않습니다',
			};
		}
		if (pathname?.startsWith('/feedback/')) {
			return {
				title: '피드백을 찾을 수 없어요',
				message: '요청하신 피드백이 존재하지 않습니다',
			};
		}
		return {
			title: '페이지를 찾을 수 없습니다',
			message: '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다',
		};
	};

	const { title, message } = getContextualMessage();

	return (
		<ErrorMessage
			title={title}
			message={message}
			errorType="not_found"
			variant="page"
			onGoHome={handleGoHome}
			onGoBack={handleGoBack}
		/>
	);
}
