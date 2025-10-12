// 결과 계산 화면
'use client';

import { useEffect, useState } from 'react';

const LOADING_MESSAGES = ['답변을 분석하고 있어요', '당신의 성향을 파악 중', '결과를 준비하는 중', '거의 다 됐어요'];

export function ResultCalculatingScreen() {
	const [messageIndex, setMessageIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
		}, 1500);

		return () => clearInterval(interval);
	}, []);

	return (
		<main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-sky-50 via-white to-blue-100">
			<article className="w-full max-w-[420px] text-center">
				{/* 회전하는 이모지들 */}
				<div className="relative w-24 h-24 mx-auto mb-8">
					<div
						className="absolute inset-0 flex items-center justify-center text-5xl animate-spin"
						style={{ animationDuration: '3s' }}
					>
						🧠
					</div>
					<div className="absolute top-0 right-0 text-2xl animate-bounce" style={{ animationDelay: '0ms' }}>
						✨
					</div>
					<div className="absolute bottom-0 left-0 text-2xl animate-bounce" style={{ animationDelay: '500ms' }}>
						💡
					</div>
				</div>

				{/* 변하는 텍스트 */}
				<h1 className="text-2xl font-bold text-gray-900 mb-6 transition-all duration-300">
					{LOADING_MESSAGES[messageIndex]}
				</h1>

				{/* 물결 모양 로딩 바 */}
				<div className="relative w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
					<div className="absolute inset-0 flex">
						<div className="h-full w-1/4 bg-blue-500 rounded-full animate-pulse" />
						<div className="h-full w-1/4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
						<div className="h-full w-1/4 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
						<div className="h-full w-1/4 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
					</div>
				</div>
			</article>
		</main>
	);
}
