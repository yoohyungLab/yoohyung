import React from 'react';
import { AdminCard, AdminCardHeader } from '@/components/ui/admin-card';
import { BarChart3 } from 'lucide-react';
import { cn } from '@pickid/shared';
import type { FunnelDataItem } from '@pickid/supabase';

interface FunnelVisualizationProps {
	funnelData: FunnelDataItem[];
}

export function FunnelVisualization({ funnelData }: FunnelVisualizationProps) {
	return (
		<AdminCard className="p-5">
			<AdminCardHeader
				title="🔍 퍼널 시각화"
				subtitle="질문별 진행 상황을 한눈에 확인"
				icon={<BarChart3 className="w-5 h-5 text-green-600" />}
			/>
			<div className="space-y-4">
				{funnelData.map((item, index) => {
					const completionRate = item.reached > 0 ? Math.round((item.completed / item.reached) * 100) : 0;
					const maxReached = Math.max(...funnelData.map((q) => q.reached));
					const barWidth = maxReached > 0 ? (item.reached / maxReached) * 100 : 0;

					return (
						<div key={item.questionId} className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-gray-700">Q{index + 1}</span>
								<div className="flex items-center gap-4 text-sm text-gray-600">
									<span>{item.reached}명</span>
									<span>→</span>
									<span>{item.completed}명</span>
									<span
										className={cn(
											'font-bold',
											completionRate > 80 ? 'text-green-600' : completionRate > 60 ? 'text-yellow-600' : 'text-red-600'
										)}
									>
										{completionRate}%
									</span>
								</div>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-4 relative">
								<div className="bg-blue-500 h-4 rounded-l-full" style={{ width: `${barWidth}%` }} />
								<div
									className={cn(
										'absolute top-0 h-4 rounded-r-full',
										completionRate > 80 ? 'bg-green-500' : completionRate > 60 ? 'bg-yellow-500' : 'bg-red-500'
									)}
									style={{
										width: `${(item.completed / maxReached) * 100}%`,
										left: '0',
									}}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</AdminCard>
	);
}
