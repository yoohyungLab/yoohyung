import React from 'react';
import { AdminCard } from '@/components/ui/admin-card';
import { Users, CheckCircle, Target, Clock } from 'lucide-react';
import type { AdminGetTestBasicStatsReturn } from '@/types/analytics.types';

interface AnalyticsStatsCardsProps {
	basicStats: AdminGetTestBasicStatsReturn | null;
}

export function AnalyticsStatsCards({ basicStats }: AnalyticsStatsCardsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<AdminCard className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-600">총 응답수</p>
						<p className="text-2xl font-bold text-gray-900">{basicStats?.totalResponses?.toLocaleString() || 0}</p>
						<p className="text-xs text-gray-500 mt-1">전체 응답</p>
					</div>
					<Users className="w-8 h-8 text-blue-600" />
				</div>
			</AdminCard>

			<AdminCard className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-600">완료수</p>
						<p className="text-2xl font-bold text-gray-900">
							{basicStats?.completedResponses?.toLocaleString() || 0}
						</p>
						<p className="text-xs text-gray-500 mt-1">완료된 응답</p>
					</div>
					<CheckCircle className="w-8 h-8 text-green-600" />
				</div>
			</AdminCard>

			<AdminCard className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-600">완료율</p>
						<p className="text-2xl font-bold text-gray-900">{basicStats?.completionRate || 0}%</p>
						<p className="text-xs text-gray-500 mt-1">완료 비율</p>
					</div>
					<Target className="w-8 h-8 text-purple-600" />
				</div>
			</AdminCard>

			<AdminCard className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-600">평균 소요시간</p>
						<p className="text-2xl font-bold text-gray-900">{basicStats?.avgTime || 0}분</p>
						<p className="text-xs text-gray-500 mt-1">완료 기준</p>
					</div>
					<Clock className="w-8 h-8 text-orange-600" />
				</div>
			</AdminCard>
		</div>
	);
}
