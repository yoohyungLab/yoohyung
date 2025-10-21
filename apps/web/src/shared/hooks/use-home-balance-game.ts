'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { homeBalanceGameService } from '@/shared/api/services/home-balance-game.service';
import { queryKeys } from '@/shared/lib/query-keys';
import type { IHomeBalanceGameResponse, IVoteResult } from '@/shared/api/services/home-balance-game.service';

/**
 * 현재 주차의 밸런스 게임 조회
 */
export function useCurrentWeekBalanceGame() {
	return useQuery<IHomeBalanceGameResponse | null>({
		queryKey: queryKeys.homeBalanceGame.current(),
		queryFn: () => homeBalanceGameService.getCurrentWeekGame(),
		staleTime: 5 * 60 * 1000, // 5분
		refetchOnWindowFocus: false,
	});
}

/**
 * 밸런스 게임 투표 뮤테이션 (중복 투표 허용)
 */
export function useVoteBalanceGame() {
	const queryClient = useQueryClient();

	return useMutation<IVoteResult, Error, { gameId: string; choice: 'A' | 'B' }>({
		mutationFn: ({ gameId, choice }) => homeBalanceGameService.vote(gameId, choice),
		onSuccess: () => {
			// 게임 데이터 갱신
			queryClient.invalidateQueries({
				queryKey: queryKeys.homeBalanceGame.current(),
			});
		},
		onError: (error) => {
			console.error('Failed to vote:', error);
		},
	});
}

/**
 * 통합 훅: 게임 정보, 투표 액션을 제공 (중복 투표 허용)
 */
export function useHomeBalanceGame() {
	const { data: game, isLoading: isGameLoading, error: gameError } = useCurrentWeekBalanceGame();
	const voteMutation = useVoteBalanceGame();

	// 로컬 상태로 투표 결과 관리 (결과 화면 표시용)
	const [localVoteResult, setLocalVoteResult] = useState<IVoteResult | null>(null);

	const handleVote = (choice: 'A' | 'B') => {
		if (!game) return;
		voteMutation.mutate(
			{ gameId: game.id, choice },
			{
				onSuccess: (data) => {
					setLocalVoteResult(data);
				},
			}
		);
	};

	const handleResetVote = () => {
		// 로컬 상태만 초기화 (다시 투표 가능)
		setLocalVoteResult(null);
		voteMutation.reset();
	};

	return {
		game,
		isLoading: isGameLoading,
		error: gameError,
		vote: handleVote,
		isVoting: voteMutation.isPending,
		voteResult: localVoteResult,
		resetVote: handleResetVote,
	};
}
