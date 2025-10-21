import { useQuery } from '@tanstack/react-query';
import { balanceGameStatsService } from '@/shared/api/services/balance-game-stats.service';
import { queryKeys } from '@/shared/lib/query-keys';

// ============================================================================
// 밸런스게임 통계 훅
// ============================================================================

/**
 * 특정 질문의 선택지 통계 조회
 */
export function useBalanceGameQuestionStats(testId: string, questionId: string) {
	return useQuery({
		queryKey: queryKeys.balanceGameStats.question(testId, questionId),
		queryFn: () => balanceGameStatsService.getQuestionStats(testId, questionId),
		enabled: !!testId && !!questionId,
		staleTime: 5 * 60 * 1000, // 5분 캐시
		refetchOnWindowFocus: false,
	});
}

/**
 * 테스트 전체 통계 조회
 */
export function useBalanceGameTestStats(testId: string) {
	return useQuery({
		queryKey: queryKeys.balanceGameStats.test(testId),
		queryFn: () => balanceGameStatsService.getTestStats(testId),
		enabled: !!testId,
		staleTime: 5 * 60 * 1000, // 5분 캐시
		refetchOnWindowFocus: false,
	});
}
