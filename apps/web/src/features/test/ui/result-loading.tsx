'use client';

import { FileText, CheckCircle, Sparkles } from 'lucide-react';

// 테스트 완료 후 결과 계산 중 표시
export function ResultLoading() {
	return (
		<main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-sky-50 via-white to-blue-100">
			<div className="w-full max-w-[420px] text-center">
				{/* 좌우로 움직이는 아이콘 */}
				<div className="relative w-full h-16 mb-8 flex items-center justify-center">
					{/* 왼쪽에서 오른쪽으로 이동하는 파일 아이콘 */}
					<div className="absolute left-0 animate-slide-right">
						<FileText className="w-8 h-8 text-blue-400" />
					</div>

					{/* 중앙 고정 */}
					<div className="relative z-10">
						<div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center">
							<Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
						</div>
					</div>

					{/* 오른쪽에서 왼쪽으로 이동하는 체크 아이콘 */}
					<div className="absolute right-0 animate-slide-left">
						<CheckCircle className="w-8 h-8 text-blue-400" />
					</div>
				</div>

				{/* 텍스트 */}
				<h1 className="text-xl font-bold text-gray-900 mb-6">결과를 분석하고 있어요</h1>

				{/* 슬라이딩 프로그레스 바 */}
				<div className="relative w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
					<div className="absolute inset-0">
						<div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-progress-slide" />
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes slide-right {
					0%,
					100% {
						transform: translateX(0);
						opacity: 0.4;
					}
					50% {
						transform: translateX(40px);
						opacity: 1;
					}
				}

				@keyframes slide-left {
					0%,
					100% {
						transform: translateX(0);
						opacity: 0.4;
					}
					50% {
						transform: translateX(-40px);
						opacity: 1;
					}
				}

				@keyframes progress-slide {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(100%);
					}
				}

				.animate-slide-right {
					animation: slide-right 2s ease-in-out infinite;
				}

				.animate-slide-left {
					animation: slide-left 2s ease-in-out infinite;
					animation-delay: 1s;
				}

				.animate-progress-slide {
					animation: progress-slide 1.5s ease-in-out infinite;
				}
			`}</style>
		</main>
	);
}
