import Link from 'next/link';

interface BalanceGame {
	id: string;
	question: string;
	optionA: string;
	optionB: string;
	votesA: number;
	votesB: number;
}

interface BalanceGameSectionProps {
	games?: BalanceGame[];
}

export function BalanceGameSection({ games = [] }: BalanceGameSectionProps) {
	const defaultGames = [
		{
			id: 'coffee-vs-tea',
			question: '아침에 마시는 음료는?',
			optionA: '☕ 커피',
			optionB: '🍵 차',
			votesA: 65,
			votesB: 35,
		},
		{
			id: 'dog-vs-cat',
			question: '더 좋아하는 동물은?',
			optionA: '🐕 강아지',
			optionB: '🐱 고양이',
			votesA: 48,
			votesB: 52,
		},
		{
			id: 'summer-vs-winter',
			question: '선호하는 계절은?',
			optionA: '☀️ 여름',
			optionB: '❄️ 겨울',
			votesA: 42,
			votesB: 58,
		},
	];

	const gameData = games.length > 0 ? games : defaultGames;

	return (
		<section className="mb-12">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-gray-900">⚖️ 밸런스 게임</h2>
				<Link href="/balance-games" className="text-blue-600 hover:text-blue-700 font-medium">
					전체보기 →
				</Link>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{gameData.map((game) => (
					<Link
						key={game.id}
						href={`/balance-games/${game.id}`}
						className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group block"
					>
						<h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
							{game.question}
						</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-gray-700">{game.optionA}</span>
								<span className="text-sm text-gray-500">{game.votesA}%</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-blue-500 h-2 rounded-full transition-all duration-300"
									style={{ width: `${game.votesA}%` }}
								/>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-gray-700">{game.optionB}</span>
								<span className="text-sm text-gray-500">{game.votesB}%</span>
							</div>
						</div>
						<div className="mt-4 text-center">
							<span className="text-xs text-gray-500">참여하기</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
