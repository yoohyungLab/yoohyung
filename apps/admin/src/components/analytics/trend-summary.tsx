import React from 'react';

type TrendData = {
	date: string;
	responses: number;
	completions: number;
};

interface TrendSummaryProps {
	trends: TrendData[];
}

export function TrendSummary({ trends }: TrendSummaryProps) {
	const totalResponses = trends.reduce((a, b) => a + b.responses, 0);
	const totalCompletions = trends.reduce((a, b) => a + b.completions, 0);
	const averageCompletionRate =
		trends.length > 0
			? Math.round(
					trends.reduce((sum, trend) => {
						const rate = trend.responses > 0 ? (trend.completions / trend.responses) * 100 : 0;
						return sum + rate;
					}, 0) / trends.length
			  )
			: 0;

	return (
		<div className="grid grid-cols-3 gap-4">
			<div className="text-center p-4 bg-blue-50 rounded-lg">
				<div className="text-2xl font-bold text-blue-600">{totalResponses.toLocaleString()}</div>
				<div className="text-sm text-blue-600">총 응답수</div>
			</div>
			<div className="text-center p-4 bg-green-50 rounded-lg">
				<div className="text-2xl font-bold text-green-600">{totalCompletions.toLocaleString()}</div>
				<div className="text-sm text-green-600">총 완료수</div>
			</div>
			<div className="text-center p-4 bg-purple-50 rounded-lg">
				<div className="text-2xl font-bold text-purple-600">{averageCompletionRate}%</div>
				<div className="text-sm text-purple-600">평균 완료율</div>
			</div>
		</div>
	);
}
