import React from 'react';
import { DeviceBreakdown } from './device-breakdown';
import { ResultDistribution } from './result-distribution';
import { SharePerformance } from './share-performance';
import type { Database } from '@repo/supabase';

type TestAnalyticsData = Database['public']['Functions']['get_test_analytics_data']['Returns'];

interface OverviewTabProps {
	testData: TestAnalyticsData | null;
	completions: number;
}

export function OverviewTab({ testData, completions }: OverviewTabProps) {
	return (
		<div className="space-y-6">
			<DeviceBreakdown testData={testData} />
			<ResultDistribution testData={testData} completions={completions} />
			<SharePerformance />
		</div>
	);
}
