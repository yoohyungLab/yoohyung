'use client';

import { useRouter } from 'next/navigation';
import { Share2, RotateCcw, Home } from 'lucide-react';

interface TestResultActionsProps {
	testId: string;
	onShare: () => void;
}

export function TestResultActions({ testId, onShare }: TestResultActionsProps) {
	const router = useRouter();

	return (
		<div className="space-y-4 pb-8">
			{/* 주요 액션 - 적절한 그라데이션과 효과 */}
			<div className="grid grid-cols-2 gap-3">
				<button
					onClick={() => router.push(`/tests/${testId}`)}
					className="group py-4 px-5 rounded-xl font-semibold text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5"
					style={{
						background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
						border: '1px solid #E5E7EB',
						color: '#374151',
						boxShadow: `
							0 4px 12px rgba(0, 0, 0, 0.08),
							inset 0 1px 2px rgba(255, 255, 255, 0.8)
						`,
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)';
						e.currentTarget.style.boxShadow = `
							0 6px 16px rgba(0, 0, 0, 0.12),
							inset 0 1px 2px rgba(255, 255, 255, 0.8)
						`;
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)';
						e.currentTarget.style.boxShadow = `
							0 4px 12px rgba(0, 0, 0, 0.08),
							inset 0 1px 2px rgba(255, 255, 255, 0.8)
						`;
					}}
				>
					<RotateCcw className="w-5 h-5 transition-transform group-hover:rotate-[-20deg]" />
					다시하기
				</button>

				<button
					onClick={onShare}
					className="group py-4 px-5 rounded-xl font-semibold text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5"
					style={{
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						border: '1px solid rgba(255, 255, 255, 0.2)',
						color: 'white',
						boxShadow: `
							0 4px 12px rgba(102, 126, 234, 0.25),
							inset 0 1px 2px rgba(255, 255, 255, 0.2)
						`,
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
						e.currentTarget.style.boxShadow = `
							0 6px 16px rgba(102, 126, 234, 0.35),
							inset 0 1px 2px rgba(255, 255, 255, 0.3)
						`;
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
						e.currentTarget.style.boxShadow = `
							0 4px 12px rgba(102, 126, 234, 0.25),
							inset 0 1px 2px rgba(255, 255, 255, 0.2)
						`;
					}}
				>
					<Share2 className="w-5 h-5" />
					공유하기
				</button>
			</div>

			{/* 홈 버튼 - 적절한 그라데이션 */}
			<button
				onClick={() => router.push('/')}
				className="w-full py-4 px-5 rounded-xl font-semibold text-[15px] transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2.5"
				style={{
					background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
					border: '1px solid #E5E7EB',
					color: '#374151',
					boxShadow: `
						0 3px 8px rgba(0, 0, 0, 0.06),
						inset 0 1px 2px rgba(255, 255, 255, 0.5)
					`,
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
					e.currentTarget.style.boxShadow = `
						0 4px 12px rgba(0, 0, 0, 0.08),
						inset 0 1px 2px rgba(255, 255, 255, 0.5)
					`;
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.background = 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)';
					e.currentTarget.style.boxShadow = `
						0 3px 8px rgba(0, 0, 0, 0.06),
						inset 0 1px 2px rgba(255, 255, 255, 0.5)
					`;
				}}
			>
				<Home className="w-5 h-5" />
				다른 테스트 보러가기
			</button>

			{/* 안내 문구 */}
			<div className="pt-2 text-center">
				<p className="text-[13px] text-gray-500 font-medium">
					친구들과 결과를 공유해보세요
					<span className="inline-block ml-1.5">👥</span>
					<span className="inline-block ml-1">✨</span>
				</p>
			</div>
		</div>
	);
}
