'use client';

import { TestCTAButtons } from '../shared/test-cta-buttons';
import { FunStatsSection } from './sections/fun-stats-section';
import { PopularTestsSection } from './sections/popular-tests-section';
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

export function BalanceGameResultContent(props: IBalanceGameResultProps) {
	const { balanceGameResult, funStats, hotTestsData, onShare, userName, testId } = props;

	return (
		<div className="max-w-lg mx-auto px-5">
			<div className="space-y-6">
				<FunStatsSection
					controversialChoice={funStats.controversialChoice}
					overwhelmingChoice={funStats.overwhelmingChoice}
				/>
				<div className="my-2 border-t border-rose-100" />
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
