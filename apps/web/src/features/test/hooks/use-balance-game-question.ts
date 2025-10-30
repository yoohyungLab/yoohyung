import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOptimizedBalanceGameQuestionStats } from '@/shared/hooks';
import { optimizedBalanceGameStatsService } from '@/shared/api/services/optimized-balance-game-stats.service';
import { queryKeys } from '@/shared/lib/query-keys';
import type { TestWithNestedDetails } from '@pickid/supabase';

/**
 * 밸런스게임 질문 통합 훅
 * - 통계 조회
 * - 선택 처리
 * - 낙관적 업데이트
 */
export function useBalanceGameQuestion(question: TestWithNestedDetails['questions'][0]) {
	const queryClient = useQueryClient();
	const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
	const [showResult, setShowResult] = useState(false);

	// 통계 조회
	const { data: stats, isLoading, error } = useOptimizedBalanceGameQuestionStats(question.id as string);

	// 선택지 증가 뮤테이션
	const incrementMutation = useMutation({
		mutationFn: (choiceId: string) => optimizedBalanceGameStatsService.incrementChoiceCount(choiceId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.optimizedBalanceGameStats.question(question.id as string),
			});
		},
	});

	// 선택 처리
	const handleSelect = useCallback(
		(choiceId: string) => {
			setSelectedChoice(choiceId);
			incrementMutation.mutate(choiceId);
			setTimeout(() => setShowResult(true), 300);
		},
		[incrementMutation]
	);

	// 낙관적 업데이트된 통계 계산
	const getOptimisticStats = useCallback(() => {
		const baseStats =
			stats?.choiceStats?.map((cs) => ({
				choiceId: cs.choiceId,
				choiceText: cs.choiceText,
				responseCount: cs.responseCount,
			})) || [];

		// 선택한 항목 +1
		const optimisticStats = question.choices.map((c) => {
			const found = baseStats.find((s) => s.choiceId === c.id);
			const baseCount = found?.responseCount || 0;
			const count = selectedChoice && c.id === selectedChoice ? baseCount + 1 : baseCount;
			return {
				choiceId: c.id,
				choiceText: c.choice_text,
				count,
			};
		});

		const total = optimisticStats.reduce((sum, s) => sum + s.count, 0);

		return optimisticStats.map((s) => ({
			...s,
			percentage: total > 0 ? Math.round((s.count / total) * 100) : 0,
		}));
	}, [stats, selectedChoice, question.choices]);

	return {
		selectedChoice,
		showResult,
		isLoading,
		error,
		handleSelect,
		getOptimisticStats,
	};
}
