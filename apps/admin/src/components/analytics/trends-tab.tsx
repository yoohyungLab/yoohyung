import React from 'react';
import { AdminCard, AdminCardHeader } from '@/components/ui/admin-card';
import { LineChart } from 'lucide-react';
import { TrendChart } from './trend-chart';
import { CompletionRateChart } from './completion-rate-chart';
import { TrendSummary } from './trend-summary';
import type { Database } from '@repo/supabase';

type TestAnalyticsData = Database['public']['Functions']['get_test_analytics_data']['Returns'];

interface TrendsTabProps {
	testData: TestAnalyticsData | null;
}

export function TrendsTab({ testData }: TrendsTabProps) {
	return (
		<div className="space-y-6">
			<AdminCard className="p-5">
				<AdminCardHeader
					title="📈 시계열 트렌드"
					subtitle="일별 응답수, 완료수, 완료율 변화"
					icon={<LineChart className="w-5 h-5 text-blue-600" />}
				/>
				{testData?.trends ? (
					<div className="space-y-6">
						<TrendChart trends={testData.trends} title="📊 일별 응답수" color="bg-blue-500" valueKey="responses" />
						<TrendChart trends={testData.trends} title="✅ 일별 완료수" color="bg-green-500" valueKey="completions" />
						<CompletionRateChart trends={testData.trends} />
						<TrendSummary trends={testData.trends} />
					</div>
				) : (
					<div className="text-center py-8 text-gray-500">
						<LineChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
						<p>트렌드 데이터가 없습니다</p>
					</div>
				)}
			</AdminCard>
		</div>
	);
}
