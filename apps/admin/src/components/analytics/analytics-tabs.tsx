import React from 'react';
import { AdminCard } from '@/components/ui/admin-card';
import { BarChart3, LineChart, PieChart } from 'lucide-react';
import { cn } from '@pickid/shared';

type TabId = 'overview' | 'trends' | 'funnel';

interface AnalyticsTabsProps {
	activeTab: TabId;
	onTabChange: (tab: TabId) => void;
}

const tabs = [
	{ id: 'overview' as const, label: '개요', icon: BarChart3 },
	{ id: 'trends' as const, label: '트렌드', icon: LineChart },
	{ id: 'funnel' as const, label: '질문별 성과분석', icon: PieChart },
];

export function AnalyticsTabs({ activeTab, onTabChange }: AnalyticsTabsProps) {
	return (
		<AdminCard className="p-3">
			<nav className="flex space-x-8">
				{tabs.map((tab) => {
					const Icon = tab.icon;
					return (
						<button
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
							className={cn(
								'flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm',
								activeTab === tab.id
									? 'border-blue-500 text-blue-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							)}
						>
							<Icon className="w-4 h-4" />
							{tab.label}
						</button>
					);
				})}
			</nav>
		</AdminCard>
	);
}
