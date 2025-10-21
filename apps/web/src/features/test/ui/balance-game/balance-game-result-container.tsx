'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TestResultShareModal } from '@/shared/components/test-result-share-modal';
import { trackResultViewed } from '@/shared/lib/analytics';
import { Loading } from '@/shared/components/loading';
import { useBalanceGameResult, useTestResultShare, useBalanceGameResultData } from '@/features/test';
import { BalanceGameResultHeader } from './balance-game-result-header';
import { BalanceGameResultContent } from './balance-game-result-content';

const MIN_LOADING_TIME = 3200; // 애니메이션 완료 시간 (마지막 단계 2400ms + 여유 800ms)

export function BalanceGameResultContainer() {
	const params = useParams();
	const testId = params?.id as string;
	const [isMinLoadingComplete, setIsMinLoadingComplete] = useState(false);

	const { balanceGameResult, isLoading: baseLoading, error, isLoggedIn, userName } = useBalanceGameResult({ testId });

	const {
		funStats,
		hotTestsData,
		isLoading: statsLoading,
		hasError,
	} = useBalanceGameResultData({
		testId,
		userAnswers: balanceGameResult?.userAnswers || [],
		enabled: !!balanceGameResult,
	});

	const { isShareModalOpen, setIsShareModalOpen, handleShare } = useTestResultShare({
		testId,
		resultName: balanceGameResult?.testMetadata?.testTitle || '',
	});

	// 최소 로딩 시간 보장
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsMinLoadingComplete(true);
		}, MIN_LOADING_TIME);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (balanceGameResult && isMinLoadingComplete) {
			trackResultViewed(testId, balanceGameResult.testMetadata?.testTitle || '', isLoggedIn);
		}
	}, [balanceGameResult, testId, isLoggedIn, isMinLoadingComplete]);

	const isLoading = baseLoading || statsLoading || !isMinLoadingComplete;

	if (isLoading) {
		return <Loading variant="result" />;
	}

	if (error) {
		window.location.href = `/not-found?error=server&message=${encodeURIComponent(error)}`;
		return null;
	}

	if (!balanceGameResult) {
		window.location.href = '/not-found?error=not_found';
		return null;
	}

	const { testMetadata, comparisonStats } = balanceGameResult;
	const displayUserName = isLoggedIn && userName ? userName : undefined;

	return (
		<div className="relative min-h-screen font-sans pt-6 pb-8 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
			<div className="relative z-10">
				<BalanceGameResultHeader balanceGameResult={balanceGameResult} userName={displayUserName} />

				<BalanceGameResultContent
					balanceGameResult={{
						testMetadata,
						userAnswers: balanceGameResult.userAnswers || [],
						comparisonStats,
					}}
					funStats={funStats}
					hotTestsData={hotTestsData}
					onShare={handleShare}
					userName={displayUserName}
					testId={testId}
				/>
			</div>

			<TestResultShareModal
				isOpen={isShareModalOpen}
				onClose={() => setIsShareModalOpen(false)}
				resultType={testMetadata?.testTitle || ''}
				totalScore={0}
				title={testMetadata?.testTitle || ''}
				description={`${displayUserName || '당신'}의 밸런스 게임 결과`}
				emoji="⚖️"
			/>
		</div>
	);
}
