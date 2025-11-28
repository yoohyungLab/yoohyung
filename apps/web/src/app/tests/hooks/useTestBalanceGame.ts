import { useQuery } from '@tanstack/react-query';
import { optimizedBalanceGameStatsService } from '@/api/services/optimized-balance-game-stats.service';
import { calculatePercentages } from '@/lib/balance-game.utils';
import { queryKeys } from '@pickid/shared';
import type { OptimizedChoiceStats } from '@pickid/supabase';

// 테스트 밸런스게임 훅 (Test 도메인 전용)

// 특정 질문의 선택지 통계 조회 (퍼센티지 계산 포함)
export function useTestBalanceGameQuestionStats(questionId: string) {
	return useQuery({
		queryKey: queryKeys.optimizedBalanceGameStats.question(questionId),
		queryFn: async () => {
			const rawStats = await optimizedBalanceGameStatsService.getQuestionStatsRaw(questionId);

			const choiceStats = calculatePercentages(rawStats.choices).map((choice) => ({
				choiceId: choice.choiceId,
				choiceText: rawStats.choices.find((c) => c.choiceId === choice.choiceId)?.choiceText || '',
				responseCount: choice.responseCount,
				percentage: choice.percentage,
			})) as OptimizedChoiceStats[];

			return {
				questionId: rawStats.questionId,
				questionText: rawStats.questionText,
				choiceStats,
				totalResponses: rawStats.totalResponses,
			};
		},
		enabled: !!questionId,
		staleTime: 30 * 1000,
		refetchOnWindowFocus: false,
	});
}

// 테스트의 모든 질문 통계 조회 (퍼센티지 계산 포함)
export function useTestBalanceGameAllQuestionStats(testId: string, enabled = true, options?: { forceFresh?: boolean }) {
	return useQuery({
		queryKey: queryKeys.optimizedBalanceGameStats.testQuestions(testId),
		queryFn: async () => {
			const rawStats = await optimizedBalanceGameStatsService.getAllQuestionStatsRaw(testId);

			return rawStats.map((question) => {
				const choiceStats = calculatePercentages(question.choices).map((choice) => ({
					choiceId: choice.choiceId,
					choiceText: question.choices.find((c) => c.choiceId === choice.choiceId)?.choiceText || '',
					responseCount: choice.responseCount,
					percentage: choice.percentage,
				})) as OptimizedChoiceStats[];

				return {
					questionId: question.questionId,
					questionText: question.questionText,
					choiceStats,
					totalResponses: question.totalResponses,
				};
			});
		},
		enabled: !!testId && enabled,
		// 결과 페이지에서는 항상 최신 데이터 가져오기
		staleTime: options?.forceFresh ? 0 : 2 * 60 * 1000,
		refetchOnMount: options?.forceFresh ? 'always' : false,
		refetchOnWindowFocus: false,
	});
}
