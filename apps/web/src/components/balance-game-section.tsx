'use client';

import Link from 'next/link';
import { useHomeBalanceGame } from '@/hooks';
import { BALANCE_GAME_TEXT } from '@/constants/balance-game';
import { BALANCE_GAME_COLORS } from '@pickid/ui/constants/colors';
import { calculateBalanceGameStats, createBalanceGameOptions, getVoteCountText } from '@/lib';

export default function BalanceGameSection() {
	const { game, isLoading, vote, isVoting, userChoice, resetVote } = useHomeBalanceGame();

	// 로딩 중이면 로딩 표시
	if (isLoading) {
		return (
			<section className="py-8">
				<h2 className="text-2xl font-black text-gray-900 mb-4">{BALANCE_GAME_TEXT.loading}</h2>
				<div className="bg-white rounded-2xl p-5 animate-pulse border border-gray-200">
					<div className="h-32 bg-gray-200 rounded-lg" />
				</div>
			</section>
		);
	}

	// 게임 데이터가 없으면 렌더링하지 않음
	if (!game) return null;

	const showResult = userChoice !== null;
	const stats = calculateBalanceGameStats(game);
	const options = createBalanceGameOptions(game, stats);

	return (
		<section className="py-8">
			<h2 className="text-2xl font-black text-gray-900 mb-4">{game.title}</h2>

			<div className="bg-white rounded-2xl p-5 relative overflow-hidden border border-gray-200 shadow-sm">
				{!showResult ? (
					<>
						<div className="grid grid-cols-2 gap-3 mb-4">
							{options.map(({ id, emoji, label }) => (
								<button
									key={id}
									onClick={() => vote(id)}
									disabled={isVoting}
									className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:border-gray-900 transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-50"
									type="button"
								>
									<div className="text-center space-y-2">
										<div
											className={`w-11 h-11 mx-auto rounded-full flex items-center justify-center text-xl ${
												id === 'A' ? BALANCE_GAME_COLORS.A.background : BALANCE_GAME_COLORS.B.background
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
							<div
								className={`w-10 h-10 ${BALANCE_GAME_COLORS.vs.background} rounded-full flex items-center justify-center ${BALANCE_GAME_COLORS.vs.border} shadow-sm`}
							>
								<span className="text-xs font-black text-gray-700">{BALANCE_GAME_TEXT.vsLabel}</span>
							</div>
						</div>

						<p className="text-xs text-center text-gray-500 mt-3">{getVoteCountText(stats.totalVotes)}</p>
					</>
				) : (
					<div className="space-y-4">
						<div className="space-y-2.5">
							{options.map(({ id, emoji, label, votes, percentage }) => {
								const isSelected = userChoice === id;
								const isA = id === 'A';

								return (
									<div
										key={id}
										className={`rounded-xl p-3.5 transition-all border ${
											isSelected
												? isA
													? `${BALANCE_GAME_COLORS.A.gradient} ${BALANCE_GAME_COLORS.A.border}`
													: `${BALANCE_GAME_COLORS.B.gradient} ${BALANCE_GAME_COLORS.B.border}`
												: `${BALANCE_GAME_COLORS.neutral.background} ${BALANCE_GAME_COLORS.neutral.border}`
										}`}
									>
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-2.5">
												<span className="text-lg">{emoji}</span>
												<span className="text-sm font-semibold text-gray-900">{label}</span>
												{isSelected && (
													<span
														className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
															isA ? BALANCE_GAME_COLORS.A.badge : BALANCE_GAME_COLORS.B.badge
														}`}
													>
														{BALANCE_GAME_TEXT.selectedBadge}
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
												isSelected
													? isA
														? BALANCE_GAME_COLORS.A.gradientBarBg
														: BALANCE_GAME_COLORS.B.gradientBarBg
													: BALANCE_GAME_COLORS.neutral.gradientBarBg
											}`}
										>
											<div
												className={`h-full transition-all duration-1000 ${
													isSelected
														? isA
															? BALANCE_GAME_COLORS.A.gradientBar
															: BALANCE_GAME_COLORS.B.gradientBar
														: BALANCE_GAME_COLORS.neutral.gradientBar
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
								href={BALANCE_GAME_TEXT.otherTestsHref}
								className="py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all text-center flex items-center justify-center"
							>
								{BALANCE_GAME_TEXT.otherTestsButton}
							</Link>
							<button
								onClick={resetVote}
								className="py-2.5 bg-white text-gray-900 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all border border-gray-200"
								type="button"
							>
								{BALANCE_GAME_TEXT.retryButton}
							</button>
						</div>
					</div>
				)}

				{!showResult && (
					<Link
						href={BALANCE_GAME_TEXT.moreGamesHref}
						className="block text-center text-xs text-gray-500 hover:text-gray-900 mt-4 w-full py-1 font-medium transition-colors"
					>
						{BALANCE_GAME_TEXT.moreGames}
					</Link>
				)}
			</div>
		</section>
	);
}
