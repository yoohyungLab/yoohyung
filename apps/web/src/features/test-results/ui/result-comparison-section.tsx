'use client';

interface ResultComparisonSectionProps {
	result: {
		id: string;
		score: number;
		category: string;
	};
}

export function ResultComparisonSection({ result }: ResultComparisonSectionProps) {
	return (
		<div className="bg-white rounded-lg p-6 shadow-sm">
			<h2 className="text-xl font-bold mb-4">다른 사람들과 비교</h2>
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<span className="text-gray-700">평균 점수</span>
					<span className="font-semibold">75점</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-gray-700">내 점수</span>
					<span className="font-bold text-blue-600">{result.score}점</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(result.score / 100) * 100}%` }} />
				</div>
			</div>
		</div>
	);
}
