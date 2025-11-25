import React from 'react';
import { Card, CardContent } from '@pickid/ui';
import { cn } from '@/utils/utils';
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
	value: number;
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
		bgColor: 'from-blue-50 to-blue-100',
		textColor: 'text-blue-600',
		valueColor: 'text-blue-700',
		iconBgColor: 'bg-blue-200',
		iconColor: 'text-blue-600',
	},
	green: {
		bgColor: 'from-green-50 to-green-100',
		textColor: 'text-green-600',
		valueColor: 'text-green-700',
		iconBgColor: 'bg-green-200',
		iconColor: 'text-green-600',
	},
	yellow: {
		bgColor: 'from-yellow-50 to-yellow-100',
		textColor: 'text-yellow-600',
		valueColor: 'text-yellow-700',
		iconBgColor: 'bg-yellow-200',
		iconColor: 'text-yellow-600',
	},
	red: {
		bgColor: 'from-red-50 to-red-100',
		textColor: 'text-red-600',
		valueColor: 'text-red-700',
		iconBgColor: 'bg-red-200',
		iconColor: 'text-red-600',
	},
	purple: {
		bgColor: 'from-purple-50 to-purple-100',
		textColor: 'text-purple-600',
		valueColor: 'text-purple-700',
		iconBgColor: 'bg-purple-200',
		iconColor: 'text-purple-600',
	},
	indigo: {
		bgColor: 'from-indigo-50 to-indigo-100',
		textColor: 'text-indigo-600',
		valueColor: 'text-indigo-700',
		iconBgColor: 'bg-indigo-200',
		iconColor: 'text-indigo-600',
	},
	pink: {
		bgColor: 'from-pink-50 to-pink-100',
		textColor: 'text-pink-600',
		valueColor: 'text-pink-700',
		iconBgColor: 'bg-pink-200',
		iconColor: 'text-pink-600',
	},
	gray: {
		bgColor: 'from-gray-50 to-gray-100',
		textColor: 'text-gray-600',
		valueColor: 'text-gray-700',
		iconBgColor: 'bg-gray-200',
		iconColor: 'text-gray-600',
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
					<Card key={stat.id} className={`border-0 shadow-sm bg-gradient-to-br ${colors.bgColor}`}>
						<CardContent className="p-3">
							<div className="flex items-center justify-between">
								<div>
									<p className={`text-xs ${colors.textColor}`}>{stat.label}</p>
									<p className={`text-lg font-bold ${colors.valueColor}`}>{stat.value}</p>
								</div>
								<div className={`w-8 h-8 ${colors.iconBgColor} rounded-full flex items-center justify-center`}>
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
