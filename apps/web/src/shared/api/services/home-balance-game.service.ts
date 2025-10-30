import { createServerClient, supabase } from '@pickid/supabase';
import type { VoteResult, HomeBalanceGameResponse } from '@pickid/supabase';

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

			// RPC 함수가 없으므로 직접 쿼리로 가져오기
			const { data, error } = await client
				.from('home_balance_games')
				.select('*')
				.eq('is_active', true)
				.order('week_number', { ascending: false })
				.limit(1)
				.maybeSingle();

			if (error) {
				console.error('Query error:', error);
				return null;
			}

			if (!data) {
				return null;
			}

			// HomeBalanceGameResponse 형식으로 변환
			return {
				id: data.id,
				title: data.title,
				option_a_emoji: data.option_a_emoji,
				option_a_label: data.option_a_label,
				option_b_emoji: data.option_b_emoji,
				option_b_label: data.option_b_label,
				total_votes: data.total_votes || 0,
				votes_a: data.votes_a || 0,
				votes_b: data.votes_b || 0,
				week_number: data.week_number,
				optionAEmoji: data.option_a_emoji,
				optionALabel: data.option_a_label,
				optionBEmoji: data.option_b_emoji,
				optionBLabel: data.option_b_label,
				totalVotes: data.total_votes || 0,
				votesA: data.votes_a || 0,
				votesB: data.votes_b || 0,
				weekNumber: data.week_number,
			};
		} catch (error) {
			console.error('Error in getCurrentWeekGame:', error);
			return null;
		}
	},

	async vote(gameId: string, choice: 'A' | 'B'): Promise<VoteResult> {
		try {
			// 클라이언트에서만 사용
			const client = supabase;

			// 1. 현재 게임 데이터 조회
			const { data: gameData, error: fetchError } = await client
				.from('home_balance_games')
				.select('votes_a, votes_b, total_votes')
				.eq('id', gameId)
				.single();

			if (fetchError) throw fetchError;

			// 2. 낙관적 업데이트 계산
			const newVotesA = choice === 'A' ? (gameData.votes_a || 0) + 1 : gameData.votes_a || 0;
			const newVotesB = choice === 'B' ? (gameData.votes_b || 0) + 1 : gameData.votes_b || 0;
			const newTotalVotes = (gameData.total_votes || 0) + 1;

			// 3. 게임 통계 업데이트
			const field = choice === 'A' ? 'votes_a' : 'votes_b';
			const { error: updateError } = await client
				.from('home_balance_games')
				.update({
					[field]: choice === 'A' ? newVotesA : newVotesB,
					total_votes: newTotalVotes,
				})
				.eq('id', gameId);

			if (updateError) throw updateError;

			const { percentageA, percentageB } = calculatePercentages(newVotesA, newVotesB, newTotalVotes);

			return {
				success: true,
				message: '투표가 완료되었습니다',
				choice,
				stats: {
					totalVotes: newTotalVotes,
					votesA: newVotesA,
					votesB: newVotesB,
					percentageA,
					percentageB,
				},
			};
		} catch (error) {
			console.error('Error in vote:', error);
			throw error;
		}
	},
};
