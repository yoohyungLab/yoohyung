'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TestResultShareModal } from '@/shared/components/test-result-share-modal';
import { TestResultStructuredData } from '@/shared/components/test-result-structured-data';
import { trackResultViewed } from '@/shared/lib/analytics';
import { useTestResult } from '../hooks/use-test-result';
import { useTestResultShare } from '../hooks/use-test-result-share';
import { TestResultHeader } from './test-result-header';
import { TestResultContent } from './test-result-content';
import { TestResultActions } from './test-result-actions';
import { TestResultLoading, TestResultError } from './test-result-states';

export function TestResultContainer() {
	const params = useParams();
	const testId = params?.id as string;

	const { testResult, totalScore, userGender, isLoading, error, isLoggedIn } = useTestResult({ testId });
	const { isShareModalOpen, setIsShareModalOpen, handleShare } = useTestResultShare({
		testId: testId || '',
		resultName: testResult?.result_name || '',
	});

	// 결과 조회 추적
	useEffect(() => {
		if (testResult) {
			trackResultViewed(testId || '', testResult.result_name, isLoggedIn);
		}
	}, [testResult, testId, isLoggedIn]);

	if (isLoading) {
		return <TestResultLoading />;
	}

	if (error || !testResult) {
		return <TestResultError error={error || '잘못된 접근입니다'} />;
	}

	// hex to rgba 변환
	const hexToRgba = (hex: string, alpha: number) => {
		const cleanHex = hex.replace('#', '');
		const r = parseInt(cleanHex.substr(0, 2), 16);
		const g = parseInt(cleanHex.substr(2, 2), 16);
		const b = parseInt(cleanHex.substr(4, 2), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	};

	// 보색 계산
	const getComplementaryColor = (hex: string) => {
		const cleanHex = hex.replace('#', '');
		const r = parseInt(cleanHex.substr(0, 2), 16);
		const g = parseInt(cleanHex.substr(2, 2), 16);
		const b = parseInt(cleanHex.substr(4, 2), 16);

		const newR = Math.min(255, Math.max(0, r + 30));
		const newG = Math.min(255, Math.max(0, g - 10));
		const newB = Math.min(255, Math.max(0, b + 40));

		return `rgba(${newR}, ${newG}, ${newB}`;
	};

	const themeColor = testResult.theme_color || '#3B82F6';
	const complementary = getComplementaryColor(themeColor);

	return (
		<div
			className="relative min-h-screen font-sans pt-6 pb-8 overflow-hidden"
			style={{
				background: '#ffffff',
			}}
		>
			{/* 미묘한 그라데이션 레이어 1 - 왼쪽 상단 */}
			<div
				className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] opacity-[0.12] pointer-events-none"
				style={{
					background: `radial-gradient(circle, ${hexToRgba(themeColor, 0.3)} 0%, transparent 70%)`,
				}}
			/>

			{/* 미묘한 그라데이션 레이어 2 - 오른쪽 중앙 */}
			<div
				className="absolute top-1/3 right-0 w-[350px] h-[350px] rounded-full blur-[60px] opacity-[0.08] pointer-events-none"
				style={{
					background: `radial-gradient(circle, ${complementary}, 0.3) 0%, transparent 70%)`,
				}}
			/>

			{/* 미묘한 그라데이션 레이어 3 - 하단 */}
			<div
				className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[60px] opacity-[0.06] pointer-events-none"
				style={{
					background: `radial-gradient(ellipse, ${hexToRgba(themeColor, 0.25)} 0%, transparent 70%)`,
				}}
			/>

			{/* 미묘한 Mesh gradient 효과 */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background: `
						radial-gradient(at 20% 30%, ${hexToRgba(themeColor, 0.06)} 0%, transparent 50%),
						radial-gradient(at 80% 20%, ${complementary}, 0.04) 0%, transparent 50%),
						radial-gradient(at 40% 80%, ${hexToRgba(themeColor, 0.04)} 0%, transparent 50%)
					`,
				}}
			/>

			{/* 컨텐츠 - 위에 배치 */}
			<div className="relative z-10">
				{/* 구조화된 데이터 */}
				<TestResultStructuredData
					testId={testId || ''}
					testTitle="심리테스트"
					resultName={testResult.result_name}
					resultDescription={testResult.description || ''}
					resultImage={testResult.background_image_url || undefined}
					totalScore={totalScore}
					userGender={userGender || undefined}
				/>

				{/* 헤더 */}
				<TestResultHeader testResult={testResult} />

				{/* 메인 콘텐츠 */}
				<TestResultContent testResult={testResult} />

				{/* 액션 버튼 */}
				<div className="max-w-md mx-auto px-5">
					<TestResultActions testId={testId || ''} onShare={handleShare} />
				</div>
			</div>

			{/* 공유 모달 */}
			<TestResultShareModal
				isOpen={isShareModalOpen}
				onClose={() => setIsShareModalOpen(false)}
				resultType={testResult.result_name || ''}
				totalScore={totalScore}
				title={testResult.result_name || ''}
				description={testResult.description || ''}
				emoji="✨"
			/>
		</div>
	);
}
