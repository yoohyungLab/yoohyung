import type { AdminGetTestAnalyticsDataReturn } from '@/types/analytics.types';
import { ResultDistribution } from './result-distribution';
import { SharePerformance } from './share-performance';

interface OverviewTabProps {
	testData: AdminGetTestAnalyticsDataReturn | null;
	completions: number;
}

export function OverviewTab({ testData, completions }: OverviewTabProps) {
	return (
		<div className="space-y-6">
			<ResultDistribution testData={testData} completions={completions} />
			<SharePerformance />
		</div>
	);
}
