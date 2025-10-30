'use client';

import { useEffect, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth';
import { calculateComparisonStats, findControversialChoice, findOverwhelmingChoice } from '@/shared/lib/balance-game';
import { mapTestWithDetailsToNested } from '@/shared/lib/test-mappers';
import { useOptimizedBalanceGameAllQuestionStats } from '@/shared/hooks';
import { testService } from '@/shared/api/services/test.service';
import type { TestWithNestedDetails } from '@pickid/supabase';

import type { BalanceGameResult, IBalanceGameStats } from '@/shared/types';

interface IUseBalanceGameResultProps {
	testId: string;
}

interface IUseBalanceGameResultReturn {
	balanceGameResult: BalanceGameResult | null;
	testDetails: TestWithNestedDetails | null;
	comparisonStats: {
		userChoicePercentage: number;
		isMinority: boolean;
		oppositePercentage: number;
	};
	funStats: {
		controversialChoice: import('@/shared/types').IControversialChoice | null;
		overwhelmingChoice: import('@/shared/types').IOverwhelmingChoice | null;
	};
	hotTestsData: Array<{
		id: string;
		testId: string;
		title: string;
		description: string;
		category: string;
		thumbnail_url: string;
		thumbnailUrl: string;
		participantCount: number;
	}>;
	isLoading: boolean;
	error: string | null;
	isLoggedIn: boolean;
	userName: string | null;
}

export function useBalanceGameResult({ testId }: IUseBalanceGameResultProps): IUseBalanceGameResultReturn {
	const [balanceGameResult, setBalanceGameResult] = useState<BalanceGameResult | null>(null);
	const [testDetails, setTestDetails] = useState<TestWithNestedDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { isAuthenticated, user } = useAuth();

	const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || null;

	const statsQuery = useOptimizedBalanceGameAllQuestionStats(testId, !!balanceGameResult);

	const { data: allTests, isLoading: testsLoading } = useQuery({
		queryKey: ['published-tests'],
		queryFn: () => testService.getPublishedTests(),
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		enabled: !!balanceGameResult,
	});

	useEffect(() => {
		if (!testId) return;

		const fetchBalanceGameResult = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const testData = await testService.getTestWithDetails(testId);
				if (testData) {
					const nestedDetails = mapTestWithDetailsToNested(testData);
					setTestDetails(nestedDetails);
				}

				let userAnswers: Array<{ questionId: string; choiceId: string }> = [];
				let aChoices = 0;
				let bChoices = 0;

				if (typeof window !== 'undefined') {
					const storedData = sessionStorage.getItem('testResult');
					if (storedData) {
						try {
							const parsedData = JSON.parse(storedData);
							if (parsedData.testId === testId && parsedData.answers) {
								userAnswers = parsedData.answers.map((answer: { questionId: string; choiceId: string }) => ({
									questionId: answer.questionId,
									choiceId: answer.choiceId,
								}));

								userAnswers.forEach((answer) => {
									if (answer.choiceId.includes('A') || answer.choiceId === 'A') {
										aChoices++;
									} else if (answer.choiceId.includes('B') || answer.choiceId === 'B') {
										bChoices++;
									}
								});
							}
						} catch (err) {
							console.warn('세션 스토리지 데이터 파싱 실패:', err);
						}
					}
				}

				const totalQuestions = testData?.questions?.length || 7;
				const testTitle = (testData?.test?.title as string) || '밸런스 게임';

				const result: BalanceGameResult = {
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

				setBalanceGameResult(result);
			} catch (err) {
				console.error('테스트 데이터 로드 실패:', err);
				setError('테스트를 불러올 수 없습니다');
				setBalanceGameResult(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchBalanceGameResult();
	}, [testId, user]);

	const comparisonStats = useMemo(() => {
		if (!statsQuery.data?.length || !balanceGameResult || !balanceGameResult.userAnswers) {
			return calculateComparisonStats(balanceGameResult?.userAnswers?.map((a) => a.choiceId) || [], []);
		}

		const cumulativeStats = statsQuery.data.reduce((acc, questionStats) => {
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
			balanceGameResult.userAnswers.map((a) => a.choiceId),
			cumulativeStats
		);
	}, [balanceGameResult, statsQuery.data]);

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

	const hotTestsData = useMemo(() => {
		if (!allTests?.length) return [];

		return allTests
			.filter((test) => test.type === 'balance' && test.id !== testId)
			.sort((a, b) => ((b.response_count as number) || 0) - ((a.response_count as number) || 0))
			.slice(0, 3)
			.map((test) => ({
				id: test.id as string,
				testId: test.id as string,
				title: test.title as string,
				description: (test.description as string) || '밸런스게임 테스트',
				category: '밸런스게임',
				thumbnail_url: (test.thumbnail_url as string) || '',
				thumbnailUrl: (test.thumbnail_url as string) || '',
				participantCount: (test.start_count as number) || 0,
			}));
	}, [allTests, testId]);

	return {
		balanceGameResult,
		testDetails,
		comparisonStats,
		funStats,
		hotTestsData,
		isLoading: isLoading || statsQuery.isLoading || testsLoading,
		error,
		isLoggedIn: isAuthenticated,
		userName,
	};
}
