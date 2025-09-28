import React from 'react';

type TrendData = {
	date: string;
	responses: number;
	completions: number;
};

interface TrendChartProps {
	trends: TrendData[];
	title: string;
	color: string;
	valueKey: 'responses' | 'completions';
}

export function TrendChart({ trends, title, color, valueKey }: TrendChartProps) {
	return (
		<div>
			<h4 className="text-lg font-semibold text-gray-900 mb-4">{title}</h4>
			<div className="h-64 bg-gray-50 rounded-lg p-4">
				<div className="grid grid-cols-7 gap-2 h-full">
					{trends.slice(-7).map((trend) => {
						const value = trend[valueKey];
						const maxValue = Math.max(...trends.map((t) => t[valueKey]));
						const height = maxValue > 0 ? (value / maxValue) * 100 : 0;

						return (
							<div key={trend.date} className="flex flex-col items-center justify-end">
								<div className={`w-full ${color} rounded-t`} style={{ height: `${height}%` }} />
								<div className="text-xs text-gray-600 mt-2 text-center">
									<div>{value}</div>
									<div className="text-xs">
										{new Date(trend.date).toLocaleDateString('ko-KR', {
											month: 'short',
											day: 'numeric',
										})}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
