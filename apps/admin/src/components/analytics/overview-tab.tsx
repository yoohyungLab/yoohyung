import React from 'react';
import { DeviceBreakdown } from './device-breakdown';
import { ResultDistribution } from './result-distribution';
import { SharePerformance } from './share-performance';
import type { GetTestAnalyticsDataReturn } from '@pickid/supabase';

type TestAnalyticsData = GetTestAnalyticsDataReturn;

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
