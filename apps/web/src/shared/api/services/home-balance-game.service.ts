import { createServerClient, supabase } from '@pickid/supabase';
import type { HomeBalanceGameResponse, VoteResult } from '@pickid/supabase';
import { calculateABPercentages } from '@/shared/lib/balance-game';

// 헬퍼

function getClient() {
	return typeof window === 'undefined' ? createServerClient() : supabase;
}

function handleError(error: unknown, context: string): never {
	console.error(`[${context}] Error:`, error);
	throw error;
}

// 홈 밸런스게임 서비스

export const homeBalanceGameService = {
	/**
	 * 현재 주의 활성 게임 조회
	 */
	async getCurrentWeekGame(): Promise<HomeBalanceGameResponse | null> {
		try {
			const client = getClient();

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

			if (!data) return null;

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

	/**
	 * 투표 실행 및 업데이트된 통계 반환
	 */
	async vote(gameId: string, choice: 'A' | 'B'): Promise<VoteResult> {
		try {
			const client = supabase;

			// 1. 현재 게임 데이터 조회
			const { data: gameData, error: fetchError } = await client
				.from('home_balance_games')
				.select('votes_a, votes_b, total_votes')
				.eq('id', gameId)
				.single();

			if (fetchError) throw fetchError;

			// 2. 새로운 값 계산
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

			// 4. 퍼센티지 계산
			const { percentageA, percentageB } = calculateABPercentages(newVotesA, newVotesB);

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
			handleError(error, 'vote');
		}
	},
};
