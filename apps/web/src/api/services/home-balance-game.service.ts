import { createServerClient, supabase } from '@pickid/supabase';
import type { HomeBalanceGameResponse, VoteResult } from '@pickid/supabase';
import { calculateABPercentages } from '@/lib/balance-game';
import { handleSupabaseError } from '@/lib';

// Type re-exports
export type { HomeBalanceGameResponse, VoteResult };

// Helper
function getClient() {
	return typeof window === 'undefined' ? createServerClient() : supabase;
}

// Home Balance Game Service
export const homeBalanceGameService = {
	// 현재 주의 활성 게임 조회
	async getCurrentWeekGame(): Promise<HomeBalanceGameResponse | null> {
		const client = getClient();

		const { data, error } = await client
			.from('home_balance_games')
			.select('*')
			.eq('is_active', true)
			.order('week_number', { ascending: false })
			.limit(1)
			.maybeSingle();

		if (error) {
			throw new Error(`홈 밸런스 게임 조회 실패: ${error.message}`);
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
	},

	// 투표 실행 및 업데이트된 통계 반환
	// Supabase RPC 함수를 사용하여 원자적으로 투표를 처리합니다.
	async vote(gameId: string, choice: 'A' | 'B'): Promise<VoteResult> {
		try {
			const client = supabase;

			// Supabase RPC 함수를 사용하여 원자적으로 투표 처리
			const { data, error } = await client.rpc('increment_balance_game_vote', {
				p_game_id: gameId,
				p_choice: choice,
			});

			if (error) {
				throw error;
			}

			// RPC 함수는 배열로 게임 객체를 반환
			const gameData = Array.isArray(data) ? data[0] : data;

			if (!gameData) {
				throw new Error('RPC 함수가 빈 응답을 반환했습니다');
			}

			// 퍼센티지 계산
			const { percentageA, percentageB } = calculateABPercentages(
				(gameData as { votes_a?: number }).votes_a || 0,
				(gameData as { votes_b?: number }).votes_b || 0
			);

			return {
				success: true,
				message: '투표가 완료되었습니다',
				choice,
				stats: {
					totalVotes: (gameData as { total_votes?: number }).total_votes || 0,
					votesA: (gameData as { votes_a?: number }).votes_a || 0,
					votesB: (gameData as { votes_b?: number }).votes_b || 0,
					percentageA,
					percentageB,
				},
			};
		} catch (error) {
			handleSupabaseError(error, 'vote');
			throw new Error('투표 처리 중 오류가 발생했습니다');
		}
	},

	// 게임 통계 조회
	async getGameStats(gameId: string) {
		const client = getClient();

		const { data, error } = await client
			.from('home_balance_games')
			.select('votes_a, votes_b, total_votes')
			.eq('id', gameId)
			.single();

		if (error) {
			throw new Error(`게임 통계 조회 실패: ${error.message}`);
		}

		const { percentageA, percentageB } = calculateABPercentages(data.votes_a || 0, data.votes_b || 0);

		return {
			votesA: data.votes_a || 0,
			votesB: data.votes_b || 0,
			totalVotes: data.total_votes || 0,
			percentageA,
			percentageB,
		};
	},
};
