'use client';

import { PopularTestsSection } from '../shared';
import { FunStatsSection } from './sections';
import type { IControversialChoice, IOverwhelmingChoice, IPopularTest } from '@/shared/types';

interface IBalanceGameResultContentProps {
	funStats: {
		controversialChoice: IControversialChoice | null;
		overwhelmingChoice: IOverwhelmingChoice | null;
	};
	hotTestsData: IPopularTest[];
}

export function BalanceGameResultContent(props: IBalanceGameResultContentProps) {
	const { funStats, hotTestsData } = props;

	return (
		<div className="max-w-lg mx-auto px-5">
			<div className="space-y-6">
				<FunStatsSection controversialChoice={funStats.controversialChoice} overwhelmingChoice={funStats.overwhelmingChoice} />
				<div className="my-2 border-t border-rose-100" />
				<PopularTestsSection hotTests={hotTestsData} error={null} />
			</div>
		</div>
	);
}
