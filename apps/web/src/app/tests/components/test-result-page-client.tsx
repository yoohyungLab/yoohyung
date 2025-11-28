'use client';

import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/auth/hooks';
import { Loading } from '@/components/loading';
import { TestResultStructuredData } from '@/components';
import { TestCTAButtons } from './shared';
import { BalanceGameResultContainer } from './balance-game/balance-game-result-container';
import { QuizResultContainer } from './quiz/quiz-result-container';
import { TestResultContainer } from './psychology/test-result-container';
import { SharedResultLanding } from './psychology/shared-result-landing';
import {
	useTestResult,
	useQuizResult,
	useBalanceGameResult,
	usePopularTests,
	useTestResultShare,
} from '../hooks';

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
	// 타입별로 enabled 조건 설정하여 불필요한 쿼리 방지
	// 공유 링크인 경우, 심리테스트는 대표 결과만 보여주므로 데이터 로드 비활성화
	const balanceGameData = useBalanceGameResult({ testId, enabled: normalizedTestType === 'balance' && !isSharedLink });
	const quizData = useQuizResult({ testId, enabled: normalizedTestType === 'quiz' && !isSharedLink });
	const psychologyData = useTestResult({ testId, enabled: normalizedTestType === 'psychology' && !isSharedLink });

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
			? quizData.resultMessage?.result_name ||
			  `${quizData.quizResult?.test_title || ''} - ${quizData.quizResult?.score || 0}점`
			: psychologyData.testResult?.result_name || '';

	// 공유 hook (모든 타입에서 사용)
	const shareData = useTestResultShare({ testId, resultName });

	// 밸런스게임 결과
	if (normalizedTestType === 'balance') {
		// 공유 링크는 밸런스게임에서 지원하지 않음 - 테스트 페이지로 안내
		if (isSharedLink) {
			return (
				<div className="min-h-screen flex flex-col items-center justify-center px-5">
					<div className="max-w-md text-center">
						<h1 className="text-2xl font-bold mb-4">친구가 밸런스게임 결과를 공유했어요!</h1>
						<p className="text-gray-600 mb-6">나도 테스트해보고 결과를 확인해보세요 ✨</p>
						<a
							href={`/tests/${testId}`}
							className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
						>
							테스트 하러 가기
						</a>
					</div>
				</div>
			);
		}

		const { balanceGameResult, funStats, error } = balanceGameData;
		const { popularTests } = popularTestsData;
		const { handleShare } = shareData;

		if (isLoading) return <Loading variant="result" />;
		if (error) {
			throw error;
		}
		if (!balanceGameResult) {
			throw new Error('결과를 불러올 수 없습니다.');
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
		// 공유 링크는 퀴즈에서 지원하지 않음 - 테스트 페이지로 안내
		if (isSharedLink) {
			return (
				<div className="min-h-screen flex flex-col items-center justify-center px-5">
					<div className="max-w-md text-center">
						<h1 className="text-2xl font-bold mb-4">친구가 퀴즈 결과를 공유했어요!</h1>
						<p className="text-gray-600 mb-6">나도 테스트해보고 결과를 확인해보세요 ✨</p>
						<a
							href={`/tests/${testId}`}
							className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
						>
							테스트 하러 가기
						</a>
					</div>
				</div>
			);
		}

		const { quizResult, resultMessage, error } = quizData;
		const { popularTests } = popularTestsData;
		const { handleShare } = shareData;

		if (isLoading) return <Loading variant="result" />;
		if (error) {
			throw error;
		}
		if (!quizResult) {
			throw new Error('결과를 불러올 수 없습니다.');
		}

		return (
			<>
				<TestResultStructuredData
					testId={testId}
					testTitle={quizResult.test_title}
					resultName={resultName}
					resultDescription={
						resultMessage?.description ||
						`${quizResult.correct_count}/${quizResult.total_questions} 정답 (${quizResult.score}점)`
					}
					totalScore={quizResult.score}
				/>
				<QuizResultContainer quizResult={quizResult} resultMessage={resultMessage} hotTestsData={popularTests} />
				<div className="max-w-lg mx-auto px-5">
					<TestCTAButtons
						testId={testId}
						mode="result"
						onShare={handleShare}
						resultName={resultName}
						isBalanceGame={false}
						className="mt-6"
					/>
				</div>
			</>
		);
	}

	// 심리테스트 결과
	const { testResult, totalScore, userGender, error } = psychologyData;
	const { handleShare } = shareData;

	if (isLoading) return <Loading variant="result" />;
	if (error) {
		throw error;
	}
	if (!testResult) {
		throw new Error('테스트 결과를 찾을 수 없습니다. 테스트를 다시 진행해주세요.');
	}

	// 공유 링크 렌더링 (심리테스트만 지원)
	if (isSharedLink) {
		return <SharedResultLanding testId={testId} />;
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
