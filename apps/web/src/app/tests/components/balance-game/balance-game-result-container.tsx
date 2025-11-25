'use client';

import { BalanceGameResultHeader, BalanceGameResultContent } from '.';
import type { BalanceGameResult, IControversialChoice, IOverwhelmingChoice } from '@/app/tests/types/balance-game';
import type { IPopularTest } from '@/types';

interface IBalanceGameResultContainerProps {
	balanceGameResult: BalanceGameResult;
	funStats: {
		controversialChoice: IControversialChoice | null;
		overwhelmingChoice: IOverwhelmingChoice | null;
	};
	hotTestsData: IPopularTest[];
	userName?: string;
}

export function BalanceGameResultContainer(props: IBalanceGameResultContainerProps) {
	const { balanceGameResult, funStats, hotTestsData, userName } = props;

	const testTitle = balanceGameResult.testMetadata?.testTitle || '';

	return (
		<div className="relative min-h-screen font-sans pt-6 pb-8 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
			<BalanceGameResultHeader testTitle={testTitle} userName={userName} />
			<BalanceGameResultContent funStats={funStats} hotTestsData={hotTestsData} />
		</div>
	);
}
