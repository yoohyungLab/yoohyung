'use client';

import { useState, useEffect } from 'react';
import { BalanceGameResult } from '@/shared/types';
import { useAuthVM } from '@/features/auth/hooks/useAuthVM';
import { testService } from '@/shared/api/services/test.service';
import { mapTestWithDetailsToNested } from '@/shared/lib/test-mappers';
import type { TestWithNestedDetails } from '@pickid/supabase';

interface UseBalanceGameResultProps {
	testId: string;
}

interface UseBalanceGameResultReturn {
	balanceGameResult: BalanceGameResult | null;
	isLoading: boolean;
	error: string | null;
	isLoggedIn: boolean;
	testDetails: TestWithNestedDetails | null;
	userName: string | null;
}

export function useBalanceGameResult({ testId }: UseBalanceGameResultProps): UseBalanceGameResultReturn {
	const [balanceGameResult, setBalanceGameResult] = useState<BalanceGameResult | null>(null);
	const [testDetails, setTestDetails] = useState<TestWithNestedDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { isAuthenticated, user } = useAuthVM();

	// 유저 이름 가져오기
	const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || null;

	useEffect(() => {
		if (!testId) return;

		const fetchBalanceGameResult = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// 테스트 데이터 로드
				const testData = await testService.getTestWithDetails(testId);
				if (testData) {
					const nestedDetails = mapTestWithDetailsToNested(testData);
					setTestDetails(nestedDetails);
				}

				// 세션 스토리지에서 실제 사용자 답변 데이터 가져오기
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

								// A/B 선택 개수 계산
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

				const totalQuestions = testData?.test_questions?.length || 7;
				const testTitle = testData?.title || '밸런스 게임';

				const result: BalanceGameResult = {
					userChoiceSummary: {
						totalQuestions,
						aChoices,
						bChoices,
						aPercentage: totalQuestions > 0 ? Math.round((aChoices / totalQuestions) * 100) : 0,
						bPercentage: totalQuestions > 0 ? Math.round((bChoices / totalQuestions) * 100) : 0,
					},
					comparisonStats: {
						userChoicePercentage: 0, // 실제 통계 데이터로 업데이트 필요
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
					userAnswers, // 실제 사용자 답변 데이터 추가
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

	return {
		balanceGameResult,
		isLoading,
		error,
		isLoggedIn: isAuthenticated,
		testDetails,
		userName,
	};
}
