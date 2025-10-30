'use client';

import Link from 'next/link';
import { useCallback } from 'react';
import { useHomeBalanceGame } from '@/shared/hooks/use-home-balance-game';

export default function BalanceGameSection() {
	const { game, isLoading, vote, isVoting, voteResult, resetVote, error } = useHomeBalanceGame();

	const handleVote = useCallback(
		(id: 'A' | 'B') => {
			vote(id);
		},
		[vote]
	);

	if (error) {
		console.error('Balance game error:', error);
		// 에러가 발생해도 컴포넌트를 숨김
		return null;
	}

	if (isLoading) {
		return (
			<section className="py-8">
				<h2 className="text-2xl font-black text-gray-900 mb-4">밸런스 게임</h2>
				<div className="bg-white rounded-2xl p-5 animate-pulse border border-gray-200">
					<div className="h-32 bg-gray-200 rounded-lg" />
				</div>
			</section>
		);
	}

	if (!game) return null;

	const showResult = voteResult !== null;
	const selectedChoice = voteResult?.choice;

	const optionAEmoji = game.optionAEmoji;
	const optionALabel = game.optionALabel;
	const optionBEmoji = game.optionBEmoji;
	const optionBLabel = game.optionBLabel;
	const totalVotes = game.totalVotes;
	const votesA = game.votesA;
	const votesB = game.votesB;

	const stats = voteResult?.stats || {
		totalVotes,
		votesA,
		votesB,
		percentageA: totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50,
		percentageB: totalVotes > 0 ? Math.round((votesB / totalVotes) * 100) : 50,
	};

	const options = [
		{
			id: 'A' as const,
			emoji: optionAEmoji,
			label: optionALabel,
			votes: stats.votesA,
			percentage: stats.percentageA,
		},
		{
			id: 'B' as const,
			emoji: optionBEmoji,
			label: optionBLabel,
			votes: stats.votesB,
			percentage: stats.percentageB,
		},
	];

	return (
		<section className="py-8">
			<h2 className="text-2xl font-black text-gray-900 mb-4">{game.title as string}</h2>

			<div className="bg-white rounded-2xl p-5 relative overflow-hidden border border-gray-200 shadow-sm">
				{!showResult ? (
					<>
						<div className="grid grid-cols-2 gap-3 mb-4">
							{options.map(({ id, emoji, label }) => (
								<button
									key={id}
									onClick={() => handleVote(id)}
									disabled={isVoting}
									className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:border-gray-900 transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
									type="button"
								>
									<div className="text-center space-y-2">
										<div
											className={`w-11 h-11 mx-auto rounded-full flex items-center justify-center text-xl ${
												id === 'A' ? 'bg-rose-50' : 'bg-pink-50'
											}`}
										>
											{emoji}
										</div>
										<p className="text-sm font-bold text-gray-900 break-keep leading-tight">{label}</p>
									</div>
								</button>
							))}
						</div>

						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
							<div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
								<span className="text-xs font-black text-gray-700">VS</span>
							</div>
						</div>

						<p className="text-xs text-center text-gray-500 mt-3">
							{stats.totalVotes > 0 ? `${stats.totalVotes.toLocaleString()}명 참여` : '아직 투표가 없습니다'}
						</p>
					</>
				) : (
					<div className="space-y-4">
						<div className="space-y-2.5">
							{options.map(({ id, emoji, label, votes, percentage }) => {
								const isSelected = selectedChoice === id;
								const isA = id === 'A';

								return (
									<div
										key={id}
										className={`rounded-xl p-3.5 transition-all border ${
											isSelected
												? isA
													? 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200'
													: 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200'
												: 'bg-gray-50 border-gray-200'
										}`}
									>
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-2.5">
												<span className="text-lg">{emoji}</span>
												<span className="text-sm font-semibold text-gray-900">{label}</span>
												{isSelected && (
													<span
														className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
															isA ? 'bg-rose-200 text-rose-700' : 'bg-pink-200 text-pink-700'
														}`}
													>
														선택
													</span>
												)}
											</div>
											<div className="text-right">
												<span className="text-sm font-bold text-gray-900">{percentage}%</span>
												<span className="text-xs text-gray-500 ml-1">({votes.toLocaleString()}명)</span>
											</div>
										</div>
										<div
											className={`h-1.5 rounded-full overflow-hidden ${
												isSelected ? (isA ? 'bg-rose-100' : 'bg-pink-100') : 'bg-gray-200'
											}`}
										>
											<div
												className={`h-full transition-all duration-1000 ${
													isSelected
														? isA
															? 'bg-gradient-to-r from-rose-400 to-pink-400'
															: 'bg-gradient-to-r from-pink-400 to-rose-400'
														: 'bg-gray-400'
												}`}
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>

						<div className="grid grid-cols-2 gap-2">
							<Link
								href="/tests"
								className="py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all text-center flex items-center justify-center"
							>
								다른 테스트 하기
							</Link>
							<button
								onClick={resetVote}
								className="py-2.5 bg-white text-gray-900 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all border border-gray-200"
								type="button"
							>
								다시하기
							</button>
						</div>
					</div>
				)}

				{!showResult && (
					<Link
						href="/tests?category=balance"
						className="block text-center text-xs text-gray-500 hover:text-gray-900 mt-4 w-full py-1 font-medium transition-colors"
					>
						더 많은 밸런스 게임 →
					</Link>
				)}
			</div>
		</section>
	);
}
