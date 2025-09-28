import { ReactNode } from 'react';
import { formatNumber, formatGrowth, getGrowthColor } from '@/shared/lib/utils';
import { AdminCard, AdminCardContent } from '@/components/ui/admin-card';

type ColorVariant = 'blue' | 'green' | 'purple' | 'orange';

interface KPICardProps {
	title: string;
	value: number | string;
	icon: ReactNode;
	color: ColorVariant;
	subtitle?: string;
	growth?: number;
	growthLabel?: string;
	showGrowth?: boolean;
}

export function KPICard({
	title,
	value,
	icon,
	color,
	subtitle,
	growth,
	growthLabel = '전주 대비',
	showGrowth = false,
}: KPICardProps) {
	const getGrowthIcon = (growth: number) => {
		if (growth > 0) return '↗️';
		if (growth < 0) return '↘️';
		return '→';
	};

	const getColorClasses = (color: ColorVariant) => {
		const colorMap = {
			blue: {
				border: 'border-l-blue-500',
				value: 'text-blue-600',
				icon: 'text-blue-500',
			},
			green: {
				border: 'border-l-green-500',
				value: 'text-green-600',
				icon: 'text-green-500',
			},
			purple: {
				border: 'border-l-purple-500',
				value: 'text-purple-600',
				icon: 'text-purple-500',
			},
			orange: {
				border: 'border-l-orange-500',
				value: 'text-orange-600',
				icon: 'text-orange-500',
			},
		};
		return colorMap[color];
	};

	const colorClasses = getColorClasses(color);

	return (
		<AdminCard className={`border-l-4 ${colorClasses.border}`} padding="lg">
			<AdminCardContent>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-600">{title}</p>
						<div className="flex items-center gap-2 mt-2">
							<span className={`text-3xl font-bold ${colorClasses.value}`}>
								{typeof value === 'number' ? formatNumber(value) : value}
							</span>
							<div className={colorClasses.icon}>{icon}</div>
						</div>
						{subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
						{showGrowth && growth !== undefined && (
							<div className="flex items-center gap-1 mt-1">
								<span className={`text-sm flex items-center gap-1 ${getGrowthColor(growth)}`}>
									<span>{getGrowthIcon(growth)}</span>
									{formatGrowth(growth)}
								</span>
								<span className="text-sm text-gray-500">{growthLabel}</span>
							</div>
						)}
					</div>
				</div>
			</AdminCardContent>
		</AdminCard>
	);
}
