import React from 'react';
import { AdminCard, AdminCardHeader } from '@/components/ui/admin-card';
import { PieChart } from 'lucide-react';
import { FunnelSummary } from './funnel-summary';
import { FunnelDetail } from './funnel-detail';
import { FunnelVisualization } from './funnel-visualization';

type FunnelDataItem = {
	questionId: string;
	question: string;
	reached: number;
	completed: number;
	dropoff: number;
	avgTime: number;
	order: number;
};

interface FunnelTabProps {
	funnelData: FunnelDataItem[];
}

export function FunnelTab({ funnelData }: FunnelTabProps) {
	return (
		<div className="space-y-6">
			<AdminCard className="p-5">
				<AdminCardHeader
					title="📊 질문별 성과분석"
					subtitle="각 질문별 상세한 이탈률, 완료율, 소요시간 분석"
					icon={<PieChart className="w-5 h-5 text-blue-600" />}
				/>
				{funnelData && funnelData.length > 0 ? (
					<div className="space-y-6">
						<FunnelSummary funnelData={funnelData} />
						<FunnelDetail funnelData={funnelData} />
						<FunnelVisualization funnelData={funnelData} />
					</div>
				) : (
					<div className="text-center py-8 text-gray-500">
						<PieChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
						<p>질문별 성과 데이터가 없습니다</p>
					</div>
				)}
			</AdminCard>
		</div>
	);
}
