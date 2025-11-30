import React from 'react';
import { Card, CardContent } from '@pickid/ui';
import { cn } from '@pickid/shared';
import {
	Hash,
	TrendingUp,
	Archive,
	Users,
	FileText,
	MessageSquare,
	BarChart3,
	Activity,
	Eye,
	CheckCircle,
	XCircle,
	Clock,
	Star,
} from 'lucide-react';

export interface StatCard {
	id: string;
	label: string;
	value: string | number;
	color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'pink' | 'gray';
	icon?: React.ReactNode;
}

export interface StatsCardsProps {
	stats: StatCard[];
	className?: string;
	columns?: 2 | 3 | 4 | 5 | 6;
}

const colorConfig = {
	blue: {
		bgColor: 'bg-white',
		textColor: 'text-neutral-600',
		valueColor: 'text-neutral-900',
		iconBgColor: 'bg-neutral-100',
		iconColor: 'text-neutral-600',
	},
	green: {
		bgColor: 'bg-white',
		textColor: 'text-neutral-600',
		valueColor: 'text-neutral-900',
		iconBgColor: 'bg-neutral-100',
		iconColor: 'text-neutral-600',
	},
	yellow: {
		bgColor: 'bg-white',
		textColor: 'text-neutral-600',
		valueColor: 'text-neutral-900',
		iconBgColor: 'bg-neutral-100',
		iconColor: 'text-neutral-600',
	},
	red: {
		bgColor: 'bg-white',
		textColor: 'text-neutral-600',
		valueColor: 'text-neutral-900',
		iconBgColor: 'bg-neutral-100',
		iconColor: 'text-neutral-600',
	},
	purple: {
		bgColor: 'bg-white',
		textColor: 'text-neutral-600',
		valueColor: 'text-neutral-900',
		iconBgColor: 'bg-neutral-100',
		iconColor: 'text-neutral-600',
	},
	indigo: {
		bgColor: 'bg-white',
		textColor: 'text-neutral-600',
		valueColor: 'text-neutral-900',
		iconBgColor: 'bg-neutral-100',
		iconColor: 'text-neutral-600',
	},
	pink: {
		bgColor: 'bg-white',
		textColor: 'text-neutral-600',
		valueColor: 'text-neutral-900',
		iconBgColor: 'bg-neutral-100',
		iconColor: 'text-neutral-600',
	},
	gray: {
		bgColor: 'bg-white',
		textColor: 'text-neutral-600',
		valueColor: 'text-neutral-900',
		iconBgColor: 'bg-neutral-100',
		iconColor: 'text-neutral-600',
	},
};

// 아이콘 매핑
const getIcon = (id: string, customIcon?: React.ReactNode) => {
	if (customIcon) return customIcon;

	const iconMap: Record<string, React.ReactNode> = {
		total: <Hash className="w-4 h-4" />,
		active: <TrendingUp className="w-4 h-4" />,
		inactive: <Archive className="w-4 h-4" />,
		users: <Users className="w-4 h-4" />,
		tests: <FileText className="w-4 h-4" />,
		feedback: <MessageSquare className="w-4 h-4" />,
		stats: <BarChart3 className="w-4 h-4" />,
		activity: <Activity className="w-4 h-4" />,
		views: <Eye className="w-4 h-4" />,
		completed: <CheckCircle className="w-4 h-4" />,
		pending: <Clock className="w-4 h-4" />,
		rejected: <XCircle className="w-4 h-4" />,
		favorites: <Star className="w-4 h-4" />,
		// 피드백 상태별 아이콘
		in_progress: <Activity className="w-4 h-4" />,
		replied: <MessageSquare className="w-4 h-4" />,
		// 사용자 상태별 아이콘
		deleted: <XCircle className="w-4 h-4" />,
		// 테스트 상태별 아이콘
		scheduled: <Clock className="w-4 h-4" />,
	};
	return iconMap[id] || <Hash className="w-4 h-4" />;
};

// 색상 매핑
const getColor = (id: string, customColor?: string) => {
	if (customColor && colorConfig[customColor as keyof typeof colorConfig]) {
		return customColor as keyof typeof colorConfig;
	}

	const colorMap: Record<string, keyof typeof colorConfig> = {
		total: 'blue',
		active: 'green',
		inactive: 'gray',
		users: 'blue',
		tests: 'purple',
		feedback: 'yellow',
		stats: 'indigo',
		activity: 'pink',
		views: 'blue',
		completed: 'green',
		pending: 'yellow',
		rejected: 'red',
		favorites: 'pink',
		// 피드백 상태별 색상
		in_progress: 'blue',
		replied: 'purple',
		// 사용자 상태별 색상
		deleted: 'red',
		// 테스트 상태별 색상
		scheduled: 'yellow',
	};
	return colorMap[id] || 'gray';
};

export function StatsCards({ stats, className, columns = 3 }: StatsCardsProps) {
	const gridCols = {
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-2 md:grid-cols-4',
		5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
		6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
	};

	return (
		<div className={cn(`grid ${gridCols[columns]} gap-3`, className)}>
			{stats.map((stat) => {
				const color = getColor(stat.id, stat.color);
				const colors = colorConfig[color];
				const icon = getIcon(stat.id, stat.icon);

				return (
					<Card key={stat.id} className={`border border-neutral-200 shadow-sm ${colors.bgColor} rounded-lg`}>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className={`text-xs ${colors.textColor}`}>{stat.label}</p>
									<p className={`text-lg font-bold ${colors.valueColor}`}>{stat.value}</p>
								</div>
								<div className={`w-10 h-10 ${colors.iconBgColor} rounded-lg flex items-center justify-center`}>
									<span className={colors.iconColor}>{icon}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
