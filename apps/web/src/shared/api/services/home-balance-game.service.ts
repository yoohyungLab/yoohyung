import { createServerClient, supabase } from '@pickid/supabase';
import type { HomeBalanceGameResponse, VoteResult } from '@pickid/supabase';
import { calculateABPercentages } from '@/shared/lib/balance-game';
import { handleSupabaseError } from '@/shared/lib';

// 헬퍼

function getClient() {
	return typeof window === 'undefined' ? createServerClient() : supabase;
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
	 * Supabase RPC 함수를 사용하여 원자적으로 투표를 처리합니다.
	 */
	async vote(gameId: string, choice: 'A' | 'B'): Promise<VoteResult> {
		try {
			const client = supabase;

			console.log('[vote] ========== VOTE START ==========');
			console.log('[vote] GameId:', gameId);
			console.log('[vote] Choice:', choice);
			console.log('[vote] Timestamp:', new Date().toISOString());

			// Supabase RPC 함수를 사용하여 원자적으로 투표 처리
			const { data, error } = await client.rpc('increment_balance_game_vote', {
				p_game_id: gameId,
				p_choice: choice,
			});

			if (error) {
				console.error('[vote] ❌ RPC error:', error);
				throw error;
			}

			console.log('[vote] ✅ RPC response:', data);
			console.log('[vote] 🔍 Is array?:', Array.isArray(data));
			console.log('[vote] 🔍 Data type:', typeof data);
			console.log('[vote] 🔍 Data stringified:', JSON.stringify(data, null, 2));

			// RPC 함수는 배열로 게임 객체를 반환
			const gameData = Array.isArray(data) ? data[0] : data;

			console.log('[vote] 🔍 gameData:', gameData);
			console.log('[vote] 🔍 gameData type:', typeof gameData);
			console.log('[vote] 🔍 gameData stringified:', JSON.stringify(gameData, null, 2));

			if (!gameData) {
				throw new Error('RPC 함수가 빈 응답을 반환했습니다');
			}

			console.log('[vote] 📊 Game data:', {
				votes_a: gameData.votes_a,
				votes_b: gameData.votes_b,
				total_votes: gameData.total_votes,
			});

			// 퍼센티지 계산
			const { percentageA, percentageB } = calculateABPercentages(gameData.votes_a, gameData.votes_b);

			const result = {
				success: true,
				message: '투표가 완료되었습니다',
				choice,
				stats: {
					totalVotes: gameData.total_votes,
					votesA: gameData.votes_a,
					votesB: gameData.votes_b,
					percentageA,
					percentageB,
				},
			};

			console.log('[vote] 🎉 Final result:', result);
			console.log('[vote] ========== VOTE END ==========');

			return result;
		} catch (error) {
			console.error('[vote] ❌❌❌ CRITICAL ERROR:', error);
			handleSupabaseError(error, 'vote');
		}
	},
};
