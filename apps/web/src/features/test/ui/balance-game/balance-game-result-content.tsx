'use client';

import { TestCTAButtons } from '../test-cta-buttons';
import { FunStatsSection } from './components/fun-stats-section';
import { PopularTestsSection } from './components/popular-tests-section';
import type { IControversialChoice, IOverwhelmingChoice, IPopularTest } from '@/shared/types';

interface IBalanceGameResultProps {
	balanceGameResult: {
		testMetadata: {
			testTitle: string;
		};
		userAnswers: Array<{
			questionId: string;
			choiceId: string;
		}>;
		comparisonStats?: {
			userChoicePercentage: number;
			isMinority: boolean;
			oppositePercentage: number;
		};
	};
	funStats: {
		controversialChoice: IControversialChoice | null;
		overwhelmingChoice: IOverwhelmingChoice | null;
	};
	hotTestsData: IPopularTest[];
	onShare?: () => void;
	userName?: string;
	testId?: string;
}

export function BalanceGameResultContent({
	balanceGameResult,
	funStats,
	hotTestsData,
	onShare,
	userName,
	testId,
}: IBalanceGameResultProps) {
	return (
		<div className="max-w-lg mx-auto px-5">
			<div className="space-y-3">
				<FunStatsSection
					controversialChoice={funStats.controversialChoice}
					overwhelmingChoice={funStats.overwhelmingChoice}
				/>

				<PopularTestsSection hotTests={hotTestsData} error={null} />
			</div>

			<TestCTAButtons
				testId={testId || ''}
				mode="result"
				onShare={onShare || (() => {})}
				resultName={balanceGameResult.testMetadata?.testTitle}
				userName={userName}
				isBalanceGame={true}
				className="mt-6"
			/>
		</div>
	);
}
