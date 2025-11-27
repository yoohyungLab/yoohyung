// Balance Game Utilities
// 밸런스 게임 통계 계산 및 옵션 생성 유틸리티

import type { HomeBalanceGameResponse } from '@/api/services';
import { BALANCE_GAME_DEFAULTS } from './balance-game-constants';

// 투표 통계 계산
export function calculateBalanceGameStats(game: HomeBalanceGameResponse) {
	const totalVotes = game.totalVotes || 0;
	const votesA = game.votesA || 0;
	const votesB = game.votesB || 0;

	return {
		totalVotes,
		votesA,
		votesB,
		percentageA: totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : BALANCE_GAME_DEFAULTS.percentageA,
		percentageB: totalVotes > 0 ? Math.round((votesB / totalVotes) * 100) : BALANCE_GAME_DEFAULTS.percentageB,
	};
}

// 밸런스 게임 옵션 생성
export function createBalanceGameOptions(
	game: HomeBalanceGameResponse,
	stats: ReturnType<typeof calculateBalanceGameStats>
) {
	return [
		{
			id: 'A' as const,
			emoji: game.optionAEmoji,
			label: game.optionALabel,
			votes: stats.votesA || 0,
			percentage: stats.percentageA || 0,
		},
		{
			id: 'B' as const,
			emoji: game.optionBEmoji,
			label: game.optionBLabel,
			votes: stats.votesB || 0,
			percentage: stats.percentageB || 0,
		},
	];
}

// 투표 참여 인원 텍스트 생성export function getVoteCountText(totalVotes: number): string {
	return totalVotes > 0 ? `${totalVotes.toLocaleString()}명 참여` : '아직 투표가 없습니다';
}
