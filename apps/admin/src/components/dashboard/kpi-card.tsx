import { ReactNode } from 'react';
import { formatNumber } from '@pickid/shared';
import { AdminCard, AdminCardContent } from '@/components/ui/admin-card';

type ColorVariant = 'blue' | 'green' | 'purple' | 'orange';

interface KPICardProps {
	title: string;
	value: number | string;
	icon: ReactNode;
	color: ColorVariant;
	subtitle?: string;
	growth?: number | string;
	growthLabel?: string;
	showGrowth?: boolean;
}

export function KPICard({
	title,
	value,
	icon,
	color: _color,
	subtitle,
	growth,
	growthLabel = '전주 대비',
	showGrowth = false,
}: KPICardProps) {
	return (
		<AdminCard className="bg-white rounded-xl shadow-sm border border-neutral-200" padding="lg">
			<AdminCardContent>
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<p className="text-sm font-medium text-neutral-600">{title}</p>
						<div className="flex items-center gap-2 mt-2">
							<span className="text-3xl font-bold text-neutral-900">
								{typeof value === 'number' ? formatNumber(value) : value}
							</span>
							<div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
								<div className="text-neutral-600">{icon}</div>
							</div>
						</div>
						{subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
						{showGrowth && growth !== undefined && (
							<div className="flex items-center gap-1 mt-1">
								<span
									className={`text-sm flex items-center gap-1 ${
										typeof growth === 'string'
											? growth === 'up'
												? 'text-green-600'
												: growth === 'down'
													? 'text-red-600'
													: 'text-gray-600'
											: growth > 0
												? 'text-green-600'
												: growth < 0
													? 'text-red-600'
													: 'text-gray-600'
									}`}
								>
									<span>
										{typeof growth === 'string'
											? growth === 'up'
												? '↗️'
												: growth === 'down'
													? '↘️'
													: '→'
											: growth > 0
												? '↗️'
												: growth < 0
													? '↘️'
													: '→'}
									</span>
									{typeof growth === 'string' ? growth : `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`}
								</span>
								<span className="text-sm text-neutral-500">{growthLabel}</span>
							</div>
						)}
					</div>
				</div>
			</AdminCardContent>
		</AdminCard>
	);
}
