import React from 'react';

type FunnelDataItem = {
	questionId: string;
	question: string;
	reached: number;
	completed: number;
	dropoff: number;
	avgTime: number;
	order: number;
};

interface FunnelSummaryProps {
	funnelData: FunnelDataItem[];
}

export function FunnelSummary({ funnelData }: FunnelSummaryProps) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
			<div className="text-center p-4 bg-blue-50 rounded-lg">
				<div className="text-2xl font-bold text-blue-600">
					{funnelData.reduce((sum, item) => sum + item.reached, 0).toLocaleString()}
				</div>
				<div className="text-sm text-blue-600">총 도달수</div>
			</div>
			<div className="text-center p-4 bg-green-50 rounded-lg">
				<div className="text-2xl font-bold text-green-600">
					{funnelData.reduce((sum, item) => sum + item.completed, 0).toLocaleString()}
				</div>
				<div className="text-sm text-green-600">총 완료수</div>
			</div>
			<div className="text-center p-4 bg-purple-50 rounded-lg">
				<div className="text-2xl font-bold text-purple-600">
					{funnelData.length > 0
						? Math.round(funnelData.reduce((sum, item) => sum + item.dropoff, 0) / funnelData.length)
						: 0}
					%
				</div>
				<div className="text-sm text-purple-600">평균 이탈률</div>
			</div>
			<div className="text-center p-4 bg-orange-50 rounded-lg">
				<div className="text-2xl font-bold text-orange-600">
					{funnelData.length > 0
						? Math.round(funnelData.reduce((sum, item) => sum + item.avgTime, 0) / funnelData.length)
						: 0}
					초
				</div>
				<div className="text-sm text-orange-600">평균 소요시간</div>
			</div>
		</div>
	);
}
