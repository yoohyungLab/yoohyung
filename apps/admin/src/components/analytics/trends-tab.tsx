// TODO: GA로 대체 - Google Analytics 4의 "탐색 → 자유 형식" 보고서 사용
// GA의 시계열 분석이 더 강력하고 세그먼트/비교 기능 제공
/*
import React from 'react';
import { AdminCard, AdminCardHeader } from '@/components/ui/admin-card';
import { LineChart } from 'lucide-react';
import { TrendChart } from './trend-chart';
import { CompletionRateChart } from './completion-rate-chart';
import { TrendSummary } from './trend-summary';
import type { Database } from '@pickid/supabase';

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
*/

// 임시 컴포넌트 (GA 전환 전까지)
import React from 'react';
import { AdminCard, AdminCardHeader } from '@/components/ui/admin-card';
import { LineChart } from 'lucide-react';

export function TrendsTab() {
	return (
		<div className="space-y-6">
			<AdminCard className="p-5">
				<AdminCardHeader
					title="📈 시계열 트렌드"
					subtitle="Google Analytics에서 확인하세요"
					icon={<LineChart className="w-5 h-5 text-blue-600" />}
				/>
				<div className="text-center py-12 text-gray-500">
					<LineChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
					<p className="mb-2 font-medium">이 기능은 Google Analytics로 이전되었습니다</p>
					<p className="text-sm mb-4">더 강력한 시계열 분석과 세그먼트 기능을 제공합니다</p>
					<div className="text-xs text-left max-w-md mx-auto bg-gray-50 p-4 rounded">
						<p className="font-semibold mb-2">GA4에서 확인하기:</p>
						<ul className="list-disc list-inside space-y-1">
							<li>탐색 → 자유 형식 → 날짜별 이벤트</li>
							<li>보고서 → 참여도 → 이벤트</li>
							<li>실시간 → 이벤트 수 (실시간)</li>
						</ul>
					</div>
				</div>
			</AdminCard>
		</div>
	);
}
