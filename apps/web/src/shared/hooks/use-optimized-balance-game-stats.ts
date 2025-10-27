import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { optimizedBalanceGameStatsService } from '@/shared/api/services/optimized-balance-game-stats.service';
import { queryKeys } from '@/shared/lib/query-keys';
import type { OptimizedQuestionStats } from '@pickid/supabase';

// ============================================================================
// 최적화된 밸런스게임 통계 훅
// ============================================================================

/**
 * 특정 질문의 선택지 통계 조회 (최적화된 버전)
 */
export function useOptimizedBalanceGameQuestionStats(questionId: string) {
	return useQuery({
		queryKey: queryKeys.optimizedBalanceGameStats.question(questionId),
		queryFn: () => optimizedBalanceGameStatsService.getQuestionStats(questionId),
		enabled: !!questionId,
		staleTime: 30 * 1000, // 30초 캐시 (실시간성 유지)
		refetchOnWindowFocus: false,
	});
}

/**
 * 테스트의 모든 질문 통계 조회 (최적화된 버전)
 */
export function useOptimizedBalanceGameAllQuestionStats(testId: string, enabled = true) {
	return useQuery({
		queryKey: queryKeys.optimizedBalanceGameStats.testQuestions(testId),
		queryFn: () => optimizedBalanceGameStatsService.getAllQuestionStats(testId),
		enabled: !!testId && enabled,
		staleTime: 2 * 60 * 1000, // 2분 캐시
		refetchOnWindowFocus: false,
	});
}

/**
 * 선택지 카운트 증가 뮤테이션 (최적화된 버전)
 */
export function useIncrementOptimizedChoiceCount() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (choiceId: string) => optimizedBalanceGameStatsService.incrementChoiceCount(choiceId),
		onSuccess: () => {
			// 관련 쿼리 무효화하여 최신 데이터 가져오기
			queryClient.invalidateQueries({
				queryKey: queryKeys.optimizedBalanceGameStats.all,
			});
		},
		onError: (error) => {
			console.error('Failed to increment choice count:', error);
		},
	});
}

/**
 * 선택지 카운트 증가 + 통계 조회 통합 훅 (최적화된 버전)
 */
export function useOptimizedBalanceGameChoiceCount(questionId: string) {
	const queryClient = useQueryClient();

	// 통계 조회
	const { data: stats, isLoading: statsLoading, error: statsError } = useOptimizedBalanceGameQuestionStats(questionId);

	// 카운트 증가 뮤테이션
	const incrementMutation = useMutation({
		mutationFn: (choiceId: string) => optimizedBalanceGameStatsService.incrementChoiceCount(choiceId),
		onSuccess: () => {
			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: queryKeys.optimizedBalanceGameStats.question(questionId),
			});
		},
		onError: (error) => {
			console.error('Failed to increment choice count:', error);
		},
	});

	// 선택지 카운트 증가 함수
	const incrementChoiceCount = (choiceId: string) => {
		incrementMutation.mutate(choiceId);
	};

	return {
		stats,
		isLoading: statsLoading || incrementMutation.isPending,
		error: statsError || incrementMutation.error,
		incrementChoiceCount,
		isIncrementing: incrementMutation.isPending,
	};
}

/**
 * 중간 결과용 - 모든 질문의 누적 통계 조회 (최적화된 버전)
 */
export function useOptimizedBalanceGameCumulativeStats(testId: string) {
	const { data: allStats, isLoading, error } = useOptimizedBalanceGameAllQuestionStats(testId);

	// 누적 통계 계산
	const cumulativeStats =
		allStats?.reduce((acc, questionStats) => {
			questionStats.choiceStats.forEach((choiceStat) => {
				const existing = acc.find((item) => item.choiceId === choiceStat.choiceId);
				if (existing) {
					existing.responseCount += choiceStat.responseCount;
				} else {
					acc.push({ ...choiceStat });
				}
			});
			return acc;
		}, [] as IOptimizedQuestionStats['choiceStats']) || [];

	// 총 응답 수 계산
	const totalResponses = allStats?.reduce((sum, questionStats) => sum + questionStats.totalResponses, 0) || 0;

	// 퍼센티지 재계산
	const normalizedStats = cumulativeStats.map((stat) => ({
		...stat,
		percentage: totalResponses > 0 ? Math.round((stat.responseCount / totalResponses) * 100) : 0,
	}));

	return {
		cumulativeStats: normalizedStats,
		totalResponses,
		isLoading,
		error,
	};
}
