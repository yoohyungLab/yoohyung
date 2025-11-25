'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { homeBalanceGameService } from '@/api/services/home-balance-game.service';
import { queryKeys } from '@pickid/shared';
import type { HomeBalanceGameResponse, VoteResult } from '@pickid/supabase';

// 홈 밸런스게임 훅 (Home 도메인 전용)

/**
 * 현재 주차의 밸런스 게임 조회
 */
export function useCurrentWeekBalanceGame() {
	return useQuery<HomeBalanceGameResponse | null>({
		queryKey: queryKeys.homeBalanceGame.current(),
		queryFn: () => homeBalanceGameService.getCurrentWeekGame(),
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		retry: false,
	});
}

/**
 * 밸런스 게임 투표 뮤테이션 (중복 투표 허용)
 */
export function useVoteBalanceGame() {
	const queryClient = useQueryClient();

	return useMutation<VoteResult, Error, { gameId: string; choice: 'A' | 'B' }>({
		mutationFn: ({ gameId, choice }) => homeBalanceGameService.vote(gameId, choice),
		onSuccess: async (data) => {
			console.log('[useVoteBalanceGame] Vote successful, refetching data');
			// 쿼리 무효화 및 즉시 다시 가져오기
			await queryClient.invalidateQueries({
				queryKey: queryKeys.homeBalanceGame.current(),
			});
			await queryClient.refetchQueries({
				queryKey: queryKeys.homeBalanceGame.current(),
			});
			console.log('[useVoteBalanceGame] Refetch completed');
		},
	});
}

interface UseHomeBalanceGameReturn {
	game: HomeBalanceGameResponse | null;
	isLoading: boolean;
	error: Error | null;
	vote: (choice: 'A' | 'B') => void;
	isVoting: boolean;
	voteResult: VoteResult | null;
	resetVote: () => void;
}

/**
 * 통합 훅: 게임 정보, 투표 액션을 제공 (중복 투표 허용)
 */
export function useHomeBalanceGame(): UseHomeBalanceGameReturn {
	const { data: game, isLoading: isGameLoading, error: gameError } = useCurrentWeekBalanceGame();
	const voteMutation = useVoteBalanceGame();

	const [localVoteResult, setLocalVoteResult] = useState<VoteResult | null>(null);

	return {
		game: game ?? null,
		isLoading: isGameLoading,
		error: gameError,
		vote: (choice: 'A' | 'B') => {
			if (!game) return;
			console.log('[useHomeBalanceGame] Voting:', choice);
			voteMutation.mutate(
				{ gameId: game.id, choice },
				{
					onSuccess: (data) => {
						console.log('[useHomeBalanceGame] Vote success:', data);
						setLocalVoteResult(data);
					},
					onError: (error) => {
						console.error('[useHomeBalanceGame] Vote error:', error);
					},
				}
			);
		},
		isVoting: voteMutation.isPending,
		voteResult: localVoteResult,
		resetVote: () => {
			console.log('[useHomeBalanceGame] Resetting vote');
			setLocalVoteResult(null);
			voteMutation.reset();
		},
	};
}
