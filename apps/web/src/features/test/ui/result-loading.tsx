// 결과 로딩 화면
'use client';

import { Brain, Sparkles, Lightbulb } from 'lucide-react';

/**
 * 테스트 완료 후 결과 계산 중 표시
 * CSS 애니메이션으로 로딩 효과 연출
 */
export function ResultLoading() {
	return (
		<main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-sky-50 via-white to-blue-100">
			<div className="w-full max-w-[420px] text-center">
				{/* 회전하는 아이콘들 */}
				<div className="relative w-24 h-24 mx-auto mb-8">
					<div
						className="absolute inset-0 flex items-center justify-center text-blue-600 animate-spin"
						style={{ animationDuration: '3s' }}
					>
						<Brain className="w-12 h-12" />
					</div>
					<div className="absolute top-0 right-0 text-yellow-500 animate-bounce">
						<Sparkles className="w-6 h-6" />
					</div>
					<div className="absolute bottom-0 left-0 text-purple-500 animate-bounce" style={{ animationDelay: '300ms' }}>
						<Lightbulb className="w-6 h-6" />
					</div>
				</div>

				{/* 애니메이션 텍스트 */}
				<h1 className="text-2xl font-bold text-gray-900 mb-6 animate-pulse">답변을 분석하고 있어요</h1>

				{/* 물결 모양 로딩 바 */}
				<div className="relative w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
					<div className="absolute inset-0 flex">
						<div className="h-full w-1/4 bg-blue-500 rounded-full animate-pulse" />
						<div className="h-full w-1/4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
						<div className="h-full w-1/4 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
						<div className="h-full w-1/4 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
					</div>
				</div>
			</div>
		</main>
	);
}
