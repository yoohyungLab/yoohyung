'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { homeBalanceGameService } from '@/api/services/home-balance-game.service';
import { queryKeys } from '@pickid/shared';
import type { HomeBalanceGameResponse, VoteResult } from '@pickid/supabase';

// 세션 스토리지 키
const VOTE_STORAGE_KEY = 'home_balance_vote';

// 투표 정보 저장/조회
function saveVoteToSession(gameId: string, choice: 'A' | 'B') {
	if (typeof window === 'undefined') return;
	sessionStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify({ gameId, choice }));
}

function getVoteFromSession(gameId: string): 'A' | 'B' | null {
	if (typeof window === 'undefined') return null;
	try {
		const stored = sessionStorage.getItem(VOTE_STORAGE_KEY);
		if (!stored) return null;
		const { gameId: storedGameId, choice } = JSON.parse(stored);
		return storedGameId === gameId ? choice : null;
	} catch {
		return null;
	}
}

function clearVoteFromSession() {
	if (typeof window === 'undefined') return;
	sessionStorage.removeItem(VOTE_STORAGE_KEY);
}

/**
 * 현재 주차의 밸런스 게임 조회
 */
export function useCurrentWeekBalanceGame() {
	return useQuery<HomeBalanceGameResponse | null>({
		queryKey: queryKeys.homeBalanceGame.current(),
		queryFn: () => homeBalanceGameService.getCurrentWeekGame(),
		staleTime: 1 * 60 * 1000, // 1분
		refetchOnWindowFocus: false,
		retry: 1,
	});
}

/**
 * 밸런스 게임 투표 뮤테이션 (중복 투표 허용)
 */
export function useVoteBalanceGame() {
	const queryClient = useQueryClient();

	return useMutation<VoteResult, Error, { gameId: string; choice: 'A' | 'B' }>({
		mutationFn: ({ gameId, choice }) => homeBalanceGameService.vote(gameId, choice),
		onSuccess: (data, variables) => {
			// 세션 스토리지에 투표 정보 저장
			saveVoteToSession(variables.gameId, variables.choice);

			// 캐시 즉시 업데이트 (optimistic)
			queryClient.setQueryData<HomeBalanceGameResponse | null>(
				queryKeys.homeBalanceGame.current(),
				(oldData) => {
					if (!oldData) return oldData;

					return {
						...oldData,
						total_votes: data.stats.totalVotes,
						votes_a: data.stats.votesA,
						votes_b: data.stats.votesB,
						totalVotes: data.stats.totalVotes,
						votesA: data.stats.votesA,
						votesB: data.stats.votesB,
					};
				}
			);

			// 서버 데이터 재조회로 확실한 동기화
			queryClient.invalidateQueries({
				queryKey: queryKeys.homeBalanceGame.current(),
			});
		},
	});
}

interface UseHomeBalanceGameReturn {
	game: HomeBalanceGameResponse | null;
	isLoading: boolean;
	vote: (choice: 'A' | 'B') => void;
	isVoting: boolean;
	userChoice: 'A' | 'B' | null;
	resetVote: () => void;
}

/**
 * 통합 훅: 게임 정보, 투표 액션을 제공 (중복 투표 허용)
 */
export function useHomeBalanceGame(): UseHomeBalanceGameReturn {
	const { data: game, isLoading } = useCurrentWeekBalanceGame();
	const voteMutation = useVoteBalanceGame();

	const userChoice = game ? getVoteFromSession(game.id) : null;

	const handleVote = (choice: 'A' | 'B') => {
		if (!game) return;
		voteMutation.mutate({ gameId: game.id, choice });
	};

	const handleResetVote = () => {
		clearVoteFromSession();
		voteMutation.reset();
	};

	return {
		game: game ?? null,
		isLoading,
		vote: handleVote,
		isVoting: voteMutation.isPending,
		userChoice,
		resetVote: handleResetVote,
	};
}
