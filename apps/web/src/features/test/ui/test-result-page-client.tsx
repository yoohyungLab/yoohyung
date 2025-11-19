'use client';

import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { Loading } from '@/shared/ui/loading';
import { TestResultStructuredData } from '@/shared/ui';
import { TestCTAButtons } from './shared';
import { BalanceGameResultContainer } from './balance-game/balance-game-result-container';
import { QuizResultContainer } from './quiz/quiz-result-container';
import { TestResultContainer } from './psychology/test-result-container';
import { SharedResultLanding } from './psychology/shared-result-landing';
import { useTestResult, useQuizResult, useBalanceGameResult, usePopularTests, useTestResultShare } from '../hooks';

interface ITestResultPageClientProps {
	testId: string;
	testType: string;
}

type TTestType = 'balance' | 'quiz' | 'psychology';

export function TestResultPageClient({ testId, testType }: ITestResultPageClientProps) {
	const searchParams = useSearchParams();
	const isSharedLink = searchParams.get('ref') === 'share';
	const normalizedTestType: TTestType = (testType as TTestType) || 'psychology';

	// 공통 데이터
	const { isAuthenticated, user } = useAuth();
	const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || null;

	// 모든 hooks를 최상위에서 호출 (React rules of hooks 준수)
	const balanceGameData = useBalanceGameResult({ testId });
	const quizData = useQuizResult({ testId });
	const psychologyData = useTestResult({ testId });

	// 타입별 데이터 선택
	const isLoading =
		normalizedTestType === 'balance'
			? balanceGameData.isLoading
			: normalizedTestType === 'quiz'
			? quizData.isLoading
			: psychologyData.isLoading;
	const popularTestsData = usePopularTests({ currentTestId: testId, enabled: !isLoading });

	// 타입별 resultName 계산 (hooks 호출 전에 필요)
	const resultName =
		normalizedTestType === 'balance'
			? balanceGameData.balanceGameResult?.testMetadata?.testTitle || ''
			: normalizedTestType === 'quiz'
			? quizData.resultMessage?.result_name || `${quizData.quizResult?.test_title || ''} - ${quizData.quizResult?.score || 0}점`
			: psychologyData.testResult?.result_name || '';

	// 공유 hook (모든 타입에서 사용)
	const shareData = useTestResultShare({ testId, resultName });

	// 밸런스게임 결과
	if (normalizedTestType === 'balance') {
		const { balanceGameResult, funStats, error } = balanceGameData;
		const { popularTests } = popularTestsData;
		const { handleShare } = shareData;

		if (isLoading) return <Loading variant="result" />;
		if (error || !balanceGameResult) {
			return <div className="flex items-center justify-center min-h-screen">결과를 불러올 수 없습니다.</div>;
		}

		return (
			<>
				<BalanceGameResultContainer
					balanceGameResult={balanceGameResult}
					funStats={funStats}
					hotTestsData={popularTests}
					userName={isAuthenticated && userName ? userName : undefined}
				/>
				<div className="max-w-lg mx-auto px-5">
					<TestCTAButtons
						testId={testId}
						mode="result"
						onShare={handleShare}
						resultName={resultName}
						userName={userName || undefined}
						isBalanceGame={true}
						className="mt-6"
					/>
				</div>
			</>
		);
	}

	// 퀴즈 결과
	if (normalizedTestType === 'quiz') {
		const { quizResult, resultMessage, error } = quizData;
		const { popularTests } = popularTestsData;
		const { handleShare } = shareData;

		if (isLoading) return <Loading variant="result" />;
		if (error || !quizResult) {
			return <div className="flex items-center justify-center min-h-screen">결과를 불러올 수 없습니다.</div>;
		}

		return (
			<>
				<TestResultStructuredData
					testId={testId}
					testTitle={quizResult.test_title}
					resultName={resultName}
					resultDescription={
						resultMessage?.description || `${quizResult.correct_count}/${quizResult.total_questions} 정답 (${quizResult.score}점)`
					}
					totalScore={quizResult.score}
				/>
				<QuizResultContainer quizResult={quizResult} resultMessage={resultMessage} hotTestsData={popularTests} />
				<div className="max-w-lg mx-auto px-5">
					<TestCTAButtons testId={testId} mode="result" onShare={handleShare} resultName={resultName} isBalanceGame={false} className="mt-6" />
				</div>
			</>
		);
	}

	// 심리테스트 결과
	const { testResult, totalScore, userGender, error } = psychologyData;
	const { handleShare } = shareData;

	if (isLoading) return <Loading variant="result" />;
	if (error || !testResult) {
		return <div className="flex items-center justify-center min-h-screen">결과를 불러올 수 없습니다.</div>;
	}

	// 공유 링크 렌더링
	if (isSharedLink) {
		return <SharedResultLanding testResult={testResult} testId={testId} />;
	}

	return (
		<>
			<TestResultStructuredData
				testId={testId}
				testTitle="심리테스트"
				resultName={resultName}
				resultDescription={testResult.description || ''}
				resultImage={testResult.background_image_url || undefined}
				totalScore={totalScore}
				userGender={userGender || undefined}
			/>
			<TestResultContainer testResult={testResult} />
			<div className="max-w-lg mx-auto px-5">
				<TestCTAButtons
					testId={testId}
					mode="result"
					onShare={handleShare}
					resultName={resultName}
					userName={isAuthenticated && userName ? userName : undefined}
					isBalanceGame={false}
					className="mt-6"
				/>
			</div>
		</>
	);
}
