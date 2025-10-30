'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TestResultShareModal } from '../psychology/test-result-share-modal';
import { trackResultViewed } from '@/shared/lib/analytics';
import { Loading } from '@/shared/ui/loading';
import { useBalanceGameResult } from '@/features/test/hooks/use-balance-game-result';
import { useTestResultShare } from '@/features/test/hooks/use-test-result-share';
import { BalanceGameResultHeader } from './balance-game-result-header';
import { BalanceGameResultContent } from './balance-game-result-content';

export function BalanceGameResultContainer() {
	const params = useParams();
	const testId = params?.id as string;

	const {
		balanceGameResult,
		comparisonStats,
		funStats,
		hotTestsData,
		isLoading,
		error,
		isLoggedIn,
		userName,
	} = useBalanceGameResult({ testId });

	const { isShareModalOpen, setIsShareModalOpen, handleShare } = useTestResultShare({
		testId,
		resultName: balanceGameResult?.testMetadata?.testTitle || '',
	});

	useEffect(() => {
		if (balanceGameResult) {
			trackResultViewed(testId, balanceGameResult.testMetadata?.testTitle || '', isLoggedIn);
		}
	}, [balanceGameResult, testId, isLoggedIn]);

	if (isLoading) return <Loading variant="result" />;

	if (error) throw typeof error === 'string' ? new Error(error) : (error as Error);
	if (!balanceGameResult) throw new Error('RESULT_NOT_FOUND');

	const { testMetadata } = balanceGameResult;
	const displayUserName = isLoggedIn && userName ? userName : undefined;

	return (
		<div className="relative min-h-screen font-sans pt-6 pb-8 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
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
