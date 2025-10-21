import { supabase, type HomeBalanceGame } from '@pickid/supabase';

// ============================================================================
// UI용 타입 (Supabase RPC 응답 및 클라이언트 상태 관리용)
// ============================================================================

export interface IHomeBalanceGameStats {
	totalVotes: number;
	votesA: number;
	votesB: number;
	percentageA: number;
	percentageB: number;
}

export interface IVoteResult {
	success: boolean;
	message: string;
	choice: 'A' | 'B';
	stats: IHomeBalanceGameStats;
}

// ============================================================================
// Supabase 타입 기반 변환 타입
// ============================================================================
// RPC 응답을 UI용 타입으로 변환하기 위한 타입
export interface IHomeBalanceGameResponse {
	id: string;
	title: string;
	optionAEmoji: string;
	optionALabel: string;
	optionBEmoji: string;
	optionBLabel: string;
	totalVotes: number;
	votesA: number;
	votesB: number;
	weekNumber: number;
}

const calculatePercentages = (votesA: number, votesB: number, totalVotes: number) => {
	if (totalVotes === 0) {
		return { percentageA: 50, percentageB: 50 };
	}
	return {
		percentageA: Math.round((votesA / totalVotes) * 100),
		percentageB: Math.round((votesB / totalVotes) * 100),
	};
};

export const homeBalanceGameService = {
	async getCurrentWeekGame(): Promise<IHomeBalanceGameResponse | null> {
		try {
			const { data, error } = await supabase.rpc('get_current_week_balance_game');

			if (error) throw error;

			const response = data as { success: boolean; game: IHomeBalanceGameResponse | null };

			if (!response || !response.success || !response.game) {
				return null;
			}

			return response.game;
		} catch (error) {
			console.error('Failed to get current week game:', error);
			return null;
		}
	},

	async vote(gameId: string, choice: 'A' | 'B'): Promise<IVoteResult> {
		try {
			const { data, error } = await supabase.rpc('increment_balance_game_vote', {
				p_game_id: gameId,
				p_choice: choice,
			});

			if (error) throw error;

			const response = data as {
				success: boolean;
				message: string;
				choice: string;
				totalVotes: number;
				votesA: number;
				votesB: number;
			};

			if (!response) throw new Error('No data returned from vote');

			const { percentageA, percentageB } = calculatePercentages(response.votesA, response.votesB, response.totalVotes);

			return {
				success: response.success,
				message: response.message,
				choice: choice,
				stats: {
					totalVotes: response.totalVotes,
					votesA: response.votesA,
					votesB: response.votesB,
					percentageA,
					percentageB,
				},
			};
		} catch (error) {
			console.error('Failed to vote:', error);
			throw error;
		}
	},
};
