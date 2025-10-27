import { createServerClient, supabase } from '@pickid/supabase';
import type { HomeBalanceGameStats, VoteResult, HomeBalanceGameResponse } from '@pickid/supabase';

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

const calculatePercentages = (votesA: number, votesB: number, totalVotes: number) => {
	if (totalVotes === 0) return { percentageA: 50, percentageB: 50 };

	return {
		percentageA: Math.round((votesA / totalVotes) * 100),
		percentageB: Math.round((votesB / totalVotes) * 100),
	};
};

export const homeBalanceGameService = {
	getClient() {
		return typeof window === 'undefined' ? createServerClient() : supabase;
	},

	async getCurrentWeekGame(): Promise<HomeBalanceGameResponse | null> {
		try {
			const client = this.getClient();
			const { data, error } = await client.rpc('get_current_week_balance_game');

			console.log('RPC call result:', { data, error });

			if (error) {
				console.error('RPC error:', error);
				throw error;
			}

			// data가 null이거나 undefined일 수 있음
			if (!data) {
				console.log('No data returned from RPC');
				return null;
			}

			const response = data as { success: boolean; game: HomeBalanceGameResponse | null };

			console.log('Parsed response:', response);

			if (!response || !response.success || !response.game) {
				console.log('No game found for current week');
				return null;
			}

			return response.game;
		} catch (error) {
			console.error('Error in getCurrentWeekGame:', error);
			handleSupabaseError(error, 'getCurrentWeekGame');
			return null; // 에러 발생 시 null 반환하여 무한 로딩 방지
		}
	},

	async vote(gameId: string, choice: 'A' | 'B'): Promise<VoteResult> {
		try {
			const client = this.getClient();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const { data, error } = await (client.rpc as any)('increment_balance_game_vote', {
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
				choice,
				stats: {
					totalVotes: response.totalVotes,
					votesA: response.votesA,
					votesB: response.votesB,
					percentageA,
					percentageB,
				},
			};
		} catch (error) {
			handleSupabaseError(error, 'vote');
			throw error;
		}
	},
};
