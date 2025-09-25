'use client';

interface ResultCtaSectionProps {
	result: {
		id: string;
		score: number;
		category: string;
	};
}

export function ResultCtaSection({}: ResultCtaSectionProps) {
	return (
		<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
			<h2 className="text-xl font-bold mb-4">결과 공유하기</h2>
			<p className="mb-4">친구들과 내 결과를 공유해보세요!</p>
			<div className="flex space-x-4">
				<button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
					카카오톡 공유
				</button>
				<button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
					링크 복사
				</button>
			</div>
		</div>
	);
}
