import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHomeBalanceGame, voteHomeBalanceGame } from '@/api/services/home-balance-game.service';
import type { HomeBalanceGame } from '@pickid/supabase';

const QUERY_KEY = ['homeBalanceGame'];

export const useHomeBalanceGame = () => {
	const queryClient = useQueryClient();
	const [userChoice, setUserChoice] = useState<'A' | 'B' | null>(null);

	const { data: gameData, isLoading } = useQuery<HomeBalanceGame>({
		queryKey: QUERY_KEY,
		queryFn: getHomeBalanceGame,
		staleTime: 5 * 60 * 1000,
	});

	const { mutate: vote, isPending: isVoting } = useMutation({
		mutationFn: (choice: 'A' | 'B') => {
			if (!gameData) throw new Error('Game data is not loaded');
			setUserChoice(choice);
			return voteHomeBalanceGame(gameData.id, choice);
		},
		onSuccess: (result) => {
			queryClient.setQueryData(QUERY_KEY, (old: HomeBalanceGame | undefined) => {
				if (!old) return undefined;
				return { ...old, votes_a: result.votes_a, votes_b: result.votes_b, total_votes: result.total_votes };
			});
		},
		onError: () => setUserChoice(null),
	});

	if (!gameData) {
		return { game: undefined, isLoading, isVoting, userChoice, vote, resetVote: () => setUserChoice(null) };
	}

	const votesA = gameData.votes_a ?? 0;
	const votesB = gameData.votes_b ?? 0;
	const total = votesA + votesB;
	const percentA = total > 0 ? Math.round((votesA / total) * 100) : 50;

	const game = {
		...gameData,
		totalVotes: total,
		options: [
			{ id: 'A' as const, label: gameData.option_a_label, emoji: gameData.option_a_emoji, votes: votesA, percentage: percentA },
			{ id: 'B' as const, label: gameData.option_b_label, emoji: gameData.option_b_emoji, votes: votesB, percentage: 100 - percentA },
		],
	};

	return { game, isLoading, isVoting, userChoice, vote, resetVote: () => setUserChoice(null) };
};
