import React from 'react';

type TrendData = {
	date: string;
	responses: number;
	completions: number;
};

interface CompletionRateChartProps {
	trends: TrendData[];
}

export function CompletionRateChart({ trends }: CompletionRateChartProps) {
	return (
		<div>
			<h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 일별 완료율</h4>
			<div className="h-64 bg-gray-50 rounded-lg p-4">
				<div className="grid grid-cols-7 gap-2 h-full">
					{trends.slice(-7).map((trend) => {
						const rate = trend.responses > 0 ? Math.round((trend.completions / trend.responses) * 100) : 0;

						return (
							<div key={trend.date} className="flex flex-col items-center justify-end">
								<div className="w-full bg-purple-500 rounded-t" style={{ height: `${rate}%` }} />
								<div className="text-xs text-gray-600 mt-2 text-center">
									<div>{rate}%</div>
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
