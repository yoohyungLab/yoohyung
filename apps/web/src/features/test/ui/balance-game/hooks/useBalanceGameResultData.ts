import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useOptimizedBalanceGameAllQuestionStats } from '@/shared/hooks';
import { testService } from '@/shared/api/services/test.service';
import { calculateComparisonStats, findControversialChoice, findOverwhelmingChoice } from '@/shared/lib/balance-game';
import type { IUseBalanceGameResultDataProps, IBalanceGameStats } from '@/shared/types';

export function useBalanceGameResultData({ testId, userAnswers, enabled = true }: IUseBalanceGameResultDataProps) {
	const optimizedStatsQuery = useOptimizedBalanceGameAllQuestionStats(testId, enabled);

	const {
		data: allTests,
		isLoading: testsLoading,
		error: testsError,
	} = useQuery({
		queryKey: ['published-tests'],
		queryFn: () => testService.getPublishedTests(),
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		enabled,
	});

	const comparisonStats = useMemo(() => {
		if (!optimizedStatsQuery.data?.length) {
			return calculateComparisonStats(
				userAnswers.map((a) => a.choiceId),
				[]
			);
		}

		const cumulativeStats = optimizedStatsQuery.data.reduce((acc, questionStats) => {
			questionStats.choiceStats.forEach((choiceStat) => {
				const existing = acc.find((item) => item.choiceId === choiceStat.choiceId);
				if (existing) {
					existing.responseCount += choiceStat.responseCount;
				} else {
					acc.push({
						id: choiceStat.choiceId,
						choice_text: choiceStat.choiceText,
						choiceId: choiceStat.choiceId,
						choiceText: choiceStat.choiceText,
						responseCount: choiceStat.responseCount,
						percentage: choiceStat.percentage,
					});
				}
			});
			return acc;
		}, [] as IBalanceGameStats[]);

		return calculateComparisonStats(
			userAnswers.map((a) => a.choiceId),
			cumulativeStats
		);
	}, [userAnswers, optimizedStatsQuery.data]);

	const funStats = useMemo(() => {
		if (!optimizedStatsQuery.data?.length) {
			return { controversialChoice: null, overwhelmingChoice: null };
		}

		const questionStats = optimizedStatsQuery.data.map((stats) => ({
			questionId: stats.questionId,
			questionText: stats.questionText,
			choiceStats: stats.choiceStats.map((cs) => ({
				id: cs.choiceId,
				choice_text: cs.choiceText,
				choiceId: cs.choiceId,
				choiceText: cs.choiceText,
				responseCount: cs.responseCount,
				percentage: cs.percentage,
			})),
			totalResponses: stats.totalResponses,
		}));

		return {
			controversialChoice: findControversialChoice(questionStats),
			overwhelmingChoice: findOverwhelmingChoice(questionStats),
		};
	}, [optimizedStatsQuery.data]);

	const hotTestsData = useMemo(() => {
		if (!allTests?.length) return [];

		return allTests
			.filter((test) => test.type === 'balance' && test.id !== testId)
			.sort((a, b) => (b.response_count || 0) - (a.response_count || 0))
			.slice(0, 3)
			.map((test) => ({
				id: test.id,
				testId: test.id,
				title: test.title,
				description: test.description || '밸런스게임 테스트',
				category: '밸런스게임',
				thumbnail_url: test.thumbnail_url || '',
				thumbnailUrl: test.thumbnail_url || '',
				participantCount: test.start_count || 0,
			}));
	}, [allTests, testId]);

	const popularQuestions = useMemo(() => {
		if (!optimizedStatsQuery.data?.length) return [];

		return [...optimizedStatsQuery.data]
			.sort((a, b) => b.totalResponses - a.totalResponses)
			.slice(0, 3)
			.map((question) => {
				if (question.choiceStats?.length < 2) {
					return { question: question.questionText, aPercentage: 50, bPercentage: 50 };
				}

				const [choiceA, choiceB] = question.choiceStats;
				return {
					question: question.questionText,
					aPercentage: choiceA.percentage,
					bPercentage: choiceB.percentage,
				};
			});
	}, [optimizedStatsQuery.data]);

	return {
		comparisonStats,
		funStats,
		hotTestsData,
		popularQuestions,
		totalResponses: optimizedStatsQuery.data?.reduce((sum, stats) => sum + stats.totalResponses, 0) || 0,
		isLoading: optimizedStatsQuery.isLoading || testsLoading,
		hasError: optimizedStatsQuery.error || testsError,
	};
}
