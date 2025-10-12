'use client';

import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useTestDetailVM } from '@/features/test/hooks';
import { TestTakingInterface } from '@/features/test-taking/ui/test-taking-interface';

export default function TestDetailPage() {
	const params = useParams();
	const router = useRouter();
	const testId = params?.id as string;

	const { test, isLoading, error } = useTestDetailVM(testId || '');

	// TestTakingInterface 내부에서 useTestTakingVM을 호출하므로 여기서는 콜백만 정의
	const handleComplete = async () => {
		// 테스트 완료 시 결과 페이지로 이동
		router.push(`/tests/${testId}/result`);
	};

	const handleExit = () => {
		router.push('/');
	};

	if (isLoading || !test) {
		// 로딩 중일 때는 테스트 시작 화면과 유사한 스타일로 표시
		return (
			<main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-sky-50 via-white to-blue-100">
				<article className="w-full max-w-[420px] text-center">
					{/* 통통 튀는 이모지 애니메이션 */}

					{/* 텍스트 */}
					<h1 className="text-2xl font-bold text-gray-900 mb-3">테스트 준비 중...</h1>
					<p className="text-base text-gray-600">금방 시작할게요!</p>

					{/* 점 애니메이션 */}
					<div className="flex justify-center gap-2 mt-8">
						<span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
						<span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
						<span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
					</div>
				</article>
			</main>
		);
	}
	if (error) notFound();

	return <TestTakingInterface test={test!} onComplete={handleComplete} onExit={handleExit} />;
}
