import { ReactNode } from 'react';
import { formatNumber, formatGrowth, getGrowthColor } from '../../shared/lib/utils';
import { AdminCard, AdminCardContent } from '../ui/admin-card';

interface KPICardProps {
	title: string;
	value: number | string;
	icon: ReactNode;
	borderColor: string;
	valueColor: string;
	iconColor: string;
	subtitle?: string;
	growth?: number;
	growthLabel?: string;
	showGrowth?: boolean;
}

export function KPICard({
	title,
	value,
	icon,
	borderColor,
	valueColor,
	iconColor,
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

	return (
		<AdminCard className={`border-l-4 ${borderColor}`} padding="lg">
			<AdminCardContent>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-600">{title}</p>
						<div className="flex items-center gap-2 mt-2">
							<span className={`text-3xl font-bold ${valueColor}`}>
								{typeof value === 'number' ? formatNumber(value) : value}
							</span>
							<div className={iconColor}>{icon}</div>
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
