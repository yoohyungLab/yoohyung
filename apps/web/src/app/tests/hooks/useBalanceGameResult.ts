'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { calculateComparisonStats, findControversialChoice, findOverwhelmingChoice } from '@/lib/balance-game.utils';
import { optimizedBalanceGameStatsService } from '@/api/services/optimized-balance-game-stats.service';
import { testService } from '@/api/services/test.service';
import { loadTestResult } from '../utils/session-storage';

type UserAnswer = { questionId: string; choiceId: string };

export function useBalanceGameResult(testId: string, enabled = true) {
	// 테스트 데이터 로드
	const { data: testData, isLoading: isLoadingTest } = useQuery({
		queryKey: ['test', testId],
		queryFn: () => testService.getTestWithDetails(testId),
		enabled: !!testId && enabled,
		staleTime: 5 * 60 * 1000,
	});

	// 세션에서 사용자 답변 로드
	const userAnswers = useMemo(() => {
		const stored = loadTestResult<{ testId: string; answers: UserAnswer[] }>();
		return stored?.testId === testId ? stored.answers : [];
	}, [testId]);

	// 사용자 선택 통계
	const userStats = useMemo(() => {
		const aCount = userAnswers.filter((a) => a.choiceId.includes('A')).length;
		const bCount = userAnswers.length - aCount;
		const total = userAnswers.length;

		return {
			totalQuestions: total,
			aChoices: aCount,
			bChoices: bCount,
			aPercentage: total > 0 ? Math.round((aCount / total) * 100) : 0,
			bPercentage: total > 0 ? Math.round((bCount / total) * 100) : 0,
		};
	}, [userAnswers]);

	// 통계 데이터 조회
	const { data: statsData, isLoading: isLoadingStats } = useQuery({
		queryKey: ['balanceGameStats', testId],
		queryFn: () => optimizedBalanceGameStatsService.getAllQuestionStatsRaw(testId),
		enabled: enabled && !!testData,
		staleTime: 0,
		refetchOnWindowFocus: false,
	});

	// 비교 통계
	const comparisonStats = useMemo(() => {
		if (!statsData?.length || !userAnswers.length) {
			return { userChoicePercentage: 0, isMinority: false, oppositePercentage: 0 };
		}

		const allChoices = statsData.flatMap((q) => q.choiceStats);
		return calculateComparisonStats(
			userAnswers.map((a) => a.choiceId),
			allChoices.map((c) => ({ choiceId: c.choiceId, choiceText: c.choiceText, responseCount: c.responseCount, percentage: c.percentage }))
		);
	}, [statsData, userAnswers]);

	// Fun Stats
	const funStats = useMemo(() => {
		if (!statsData?.length) return { controversialChoice: null, overwhelmingChoice: null };

		const questions = statsData.map((q) => ({
			questionId: q.questionId,
			questionText: q.questionText,
			choiceStats: q.choiceStats.map((c) => ({ id: c.choiceId, choice_text: c.choiceText, responseCount: c.responseCount, percentage: c.percentage })),
			totalResponses: q.totalResponses,
		}));

		return {
			controversialChoice: findControversialChoice(questions),
			overwhelmingChoice: findOverwhelmingChoice(questions),
		};
	}, [statsData]);

	const result = testData
		? {
				userChoiceSummary: userStats,
				comparisonStats,
				overallStats: {
					totalParticipants: statsData?.reduce((sum, q) => sum + q.totalResponses, 0) ?? 0,
					mostPopularChoice: { question: '', choice: '', percentage: 0 },
					mostControversialQuestion: { question: '', aPercentage: 0, bPercentage: 0 },
					averageTimeSpent: 0,
				},
				testMetadata: {
					testId,
					testTitle: testData.test?.title || '밸런스 게임',
					category: '밸런스 게임',
					completedAt: new Date().toISOString(),
				},
				userAnswers,
			}
		: null;

	return {
		balanceGameResult: result,
		testDetails: testData,
		comparisonStats,
		funStats,
		isLoading: isLoadingTest || isLoadingStats,
		error: testData === null ? '테스트를 불러올 수 없습니다' : null,
	};
}
