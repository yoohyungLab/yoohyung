import React from 'react';
import { User, Clock, Calendar, Monitor } from 'lucide-react';
import { StatsCards } from '@/components/ui';
import type { UserResponseStats } from '@pickid/supabase';

interface ResponseStatsCardsProps {
	stats: UserResponseStats;
}

export function ResponseStatsCards({ stats }: ResponseStatsCardsProps) {
	return (
		<StatsCards
			stats={[
				{
					id: 'total',
					label: '총 응답 수',
					value: stats.total_responses,
					icon: <User className="w-5 h-5" />,
					color: 'blue',
				},
				{
					id: 'completed',
					label: '완료율',
					value: `${stats.completion_rate}%`,
					icon: <Clock className="w-5 h-5" />,
					color: 'green',
				},
				{
					id: 'avg_time',
					label: '평균 소요시간',
					value: `${stats.avg_completion_time}초`,
					icon: <Calendar className="w-5 h-5" />,
					color: 'purple',
				},
				{
					id: 'mobile_ratio',
					label: '모바일 비율',
					value: `${stats.mobile_ratio}%`,
					icon: <Monitor className="w-5 h-5" />,
					color: 'yellow',
				},
			]}
			columns={4}
		/>
	);
}
