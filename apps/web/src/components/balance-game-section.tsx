'use client';

import Link from 'next/link';
import { useHomeBalanceGame } from '@/hooks';
import { BALANCE_GAME_COLORS } from '@pickid/ui/constants/colors';

export default function BalanceGameSection() {
	const { game, isLoading, vote, isVoting, userChoice, resetVote } = useHomeBalanceGame();

	if (isLoading) {
		return (
			<section className="py-8">
				<div className="h-8 w-3/4 bg-gray-200 rounded-md mb-4 animate-pulse" />
				<div className="bg-white rounded-2xl p-5 animate-pulse border border-gray-200">
					<div className="h-32 bg-gray-200 rounded-lg" />
				</div>
			</section>
		);
	}

	if (!game) return null;

	const showResult = userChoice !== null;

	return (
		<section className="py-8">
			<h2 className="text-2xl font-black text-gray-900 mb-4">{game.title}</h2>

			<div className="bg-white rounded-2xl p-5 relative overflow-hidden border border-gray-200 shadow-sm">
				{!showResult ? (
					<>
						<div className="grid grid-cols-2 gap-3 mb-4">
							{game.options.map(({ id, emoji, label }) => (
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
								<span className="text-xs font-black text-gray-700">VS</span>
							</div>
						</div>

						<p className="text-xs text-center text-gray-500 mt-3">{`${game.totalVotes.toLocaleString()}명이 참여했어요!`}</p>
					</>
				) : (
					<div className="space-y-4">
						<div className="space-y-2.5">
							{game.options.map(({ id, emoji, label, votes, percentage }) => {
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
														내 선택
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
								href="/tests"
								className="py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all text-center flex items-center justify-center"
							>
								다른 테스트 둘러보기
							</Link>
							<button
								onClick={resetVote}
								className="py-2.5 bg-white text-gray-900 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all border border-gray-200"
								type="button"
							>
								다시 투표하기
							</button>
						</div>
					</div>
				)}

				{!showResult && (
					<Link
						href="/tests/balance"
						className="block text-center text-xs text-gray-500 hover:text-gray-900 mt-4 w-full py-1 font-medium transition-colors"
					>
						더 많은 밸런스게임 보기 →
					</Link>
				)}
			</div>
		</section>
	);
}
