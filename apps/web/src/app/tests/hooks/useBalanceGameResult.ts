'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { calculateComparisonStats, findControversialChoice, findOverwhelmingChoice } from '@/lib/balance-game.utils';
import { useTestBalanceGameAllQuestionStats } from '@/app/tests/hooks';
import { testService } from '@/api/services/test.service';
import { loadTestResult } from '../utils/session-storage';
import type { BalanceGameResult } from '@/app/tests/types/balance-game';
import type { OptimizedChoiceStats } from '@pickid/supabase';

interface IUserAnswer {
	questionId: string;
	choiceId: string;
}

interface IBalanceGameResultData {
	testId: string;
	answers: IUserAnswer[];
}

interface IUseBalanceGameResultProps {
	testId: string;
	enabled?: boolean;
}

// Helper: 세션에서 사용자 답변 로드
function getUserAnswers(testId: string): IUserAnswer[] {
	const storedData = loadTestResult<IBalanceGameResultData>();
	if (!storedData || storedData.testId !== testId) return [];
	return storedData.answers || [];
}

// Helper: 선택 카운트
function countChoices(userAnswers: IUserAnswer[]) {
	let aChoices = 0;
	let bChoices = 0;

	userAnswers.forEach((answer) => {
		if (answer.choiceId.includes('A') || answer.choiceId === 'A') {
			aChoices++;
		} else if (answer.choiceId.includes('B') || answer.choiceId === 'B') {
			bChoices++;
		}
	});

	return { aChoices, bChoices };
}

// Helper: BalanceGameResult 생성
function createBalanceGameResult(
	testId: string,
	testTitle: string,
	userAnswers: IUserAnswer[],
	totalQuestions: number
): BalanceGameResult {
	const { aChoices, bChoices } = countChoices(userAnswers);

	return {
		userChoiceSummary: {
			totalQuestions,
			aChoices,
			bChoices,
			aPercentage: totalQuestions > 0 ? Math.round((aChoices / totalQuestions) * 100) : 0,
			bPercentage: totalQuestions > 0 ? Math.round((bChoices / totalQuestions) * 100) : 0,
		},
		comparisonStats: {
			userChoicePercentage: 0,
			isMinority: false,
			oppositePercentage: 0,
		},
		overallStats: {
			totalParticipants: 0,
			mostPopularChoice: {
				question: '데이터를 불러오는 중...',
				choice: '',
				percentage: 0,
			},
			mostControversialQuestion: {
				question: '데이터를 불러오는 중...',
				aPercentage: 0,
				bPercentage: 0,
			},
			averageTimeSpent: 0,
		},
		testMetadata: {
			testId,
			testTitle,
			category: '밸런스 게임',
			completedAt: new Date().toISOString(),
		},
		userAnswers,
	};
}

export function useBalanceGameResult({ testId, enabled = true }: IUseBalanceGameResultProps) {
	// 테스트 데이터 로드 (React Query)
	const { data: testData, isLoading: isLoadingTest } = useQuery({
		queryKey: ['test', testId],
		queryFn: () => testService.getTestWithDetails(testId),
		enabled: !!testId && enabled,
		staleTime: 5 * 60 * 1000,
	});

	// 밸런스게임 결과 생성
	const balanceGameResult = useMemo(() => {
		if (!testData) return null;

		const userAnswers = getUserAnswers(testId);
		const totalQuestions = testData.questions?.length || 7;
		const testTitle = testData.test?.title || '밸런스 게임';

		return createBalanceGameResult(testId, testTitle, userAnswers, totalQuestions);
	}, [testData, testId]);

	// 통계 데이터 조회
	const statsQuery = useTestBalanceGameAllQuestionStats(testId, enabled && !!balanceGameResult, { forceFresh: true });

	// 비교 통계 계산
	const comparisonStats = useMemo(() => {
		if (!statsQuery.data?.length || !balanceGameResult?.userAnswers) {
			return calculateComparisonStats([], []);
		}

		const cumulativeStats = statsQuery.data.reduce((acc, questionStats) => {
			questionStats.choiceStats.forEach((choiceStat) => {
				const existing = acc.find((item) => item.choiceId === choiceStat.choiceId);
				if (existing) {
					existing.responseCount += choiceStat.responseCount;
				} else {
					acc.push({
						choiceId: choiceStat.choiceId,
						choiceText: choiceStat.choiceText,
						responseCount: choiceStat.responseCount,
						percentage: choiceStat.percentage,
					});
				}
			});
			return acc;
		}, [] as OptimizedChoiceStats[]);

		return calculateComparisonStats(
			balanceGameResult.userAnswers.map((a) => a.choiceId),
			cumulativeStats
		);
	}, [balanceGameResult, statsQuery.data]);

	// Fun Stats 계산
	const funStats = useMemo(() => {
		if (!statsQuery.data?.length) {
			return { controversialChoice: null, overwhelmingChoice: null };
		}

		const questionStats = statsQuery.data.map((stats) => ({
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
	}, [statsQuery.data]);

	return {
		balanceGameResult,
		testDetails: testData,
		comparisonStats,
		funStats,
		isLoading: isLoadingTest || statsQuery.isLoading,
		error: testData === null ? '테스트를 불러올 수 없습니다' : null,
	};
}
