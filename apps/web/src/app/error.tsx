'use client';

import { useEffect } from 'react';
import { Button } from '@pickid/ui';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// 에러 로깅
		console.error('Application error:', error);
	}, [error]);

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="text-center max-w-md">
				<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>
				<h2 className="text-xl font-semibold text-gray-900 mb-2">문제가 발생했습니다</h2>
				<p className="text-gray-600 mb-6">일시적인 오류가 발생했습니다. 다시 시도해주세요.</p>
				<div className="space-y-3">
					<Button onClick={reset} className="w-full">
						다시 시도
					</Button>
					<Button variant="outline" onClick={() => (window.location.href = '/')} className="w-full">
						홈으로 이동
					</Button>
				</div>
			</div>
		</div>
	);
}
