'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { homeBalanceGameService } from '@/shared/api/services/home-balance-game.service';
import { queryKeys } from '@/shared/lib/query-keys';
import type { HomeBalanceGameResponse, VoteResult } from '@pickid/supabase';

/**
 * 현재 주차의 밸런스 게임 조회
 */
export function useCurrentWeekBalanceGame() {
	return useQuery<HomeBalanceGameResponse | null>({
		queryKey: queryKeys.homeBalanceGame.current(),
		queryFn: () => homeBalanceGameService.getCurrentWeekGame(),
		staleTime: 5 * 60 * 1000, // 5분
		refetchOnWindowFocus: false,
		retry: false, // RPC 함수가 없으면 재시도하지 않음
		onError: (error) => {
			console.error('Failed to fetch current week balance game:', error);
		},
	});
}

/**
 * 밸런스 게임 투표 뮤테이션 (중복 투표 허용)
 */
export function useVoteBalanceGame() {
	const queryClient = useQueryClient();

	return useMutation<VoteResult, Error, { gameId: string; choice: 'A' | 'B' }>({
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

	// 로컬 상태로 투표 결과 관리 (결과 화면 표시용)
	const [localVoteResult, setLocalVoteResult] = useState<VoteResult | null>(null);

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
