'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@pickid/supabase';
import type { TestAnswer } from '@/shared/types';
import type { TestResult } from '@pickid/supabase';

// ============================================================================
// 타입 정의
// ============================================================================

// 테스트 결과 데이터 - Supabase TestResult 타입 기반
interface ITestResultData extends Pick<TestResult, 'test_id'> {
	// Supabase에 없는 클라이언트 전용 필드들
	testId: string;
	answers: TestAnswer[];
	completedAt: string;
	duration: number;
	gender?: string;
}

// 매칭 조건 - Supabase TestResult의 match_conditions 필드 기반
interface IMatchConditions {
	min?: number;
	max?: number;
}

// 세션 데이터 - Supabase TestResult 타입 기반
interface ISessionData extends Pick<TestResult, 'test_id' | 'result_name' | 'description' | 'features'> {
	// Supabase에 없는 클라이언트 전용 필드들
	testId: string;
	totalScore: number;
	resultId: string;
	completedAt: string;
	duration: number;
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

const generateSessionId = (userId?: string) => {
	return userId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const saveToSessionStorage = (data: ISessionData) => {
	if (typeof window !== 'undefined') {
		sessionStorage.setItem('testResult', JSON.stringify(data));
	}
};

// ============================================================================
// 테스트 결과 ViewModel
// ============================================================================

export function useTestResultVM() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 점수 계산
	const calculateScore = useCallback(async (testId: string, answers: TestAnswer[]): Promise<number> => {
		try {
			let totalScore = 0;

			for (const answer of answers) {
				const { data: choiceData, error: choiceError } = await supabase
					.from('test_choices')
					.select('score')
					.eq('id', answer.choiceId)
					.single();

				if (choiceError) {
					console.error('Error fetching choice score:', answer.choiceId, choiceError);
					continue;
				}

				totalScore += choiceData.score || 0;
			}

			return totalScore;
		} catch (err) {
			console.error('Error calculating score:', err);
			return 0;
		}
	}, []);

	// 결과 매칭 (성별 고려)
	const findMatchingResult = useCallback(
		async (testId: string, totalScore: number, gender?: string): Promise<TestResult | null> => {
			try {
				const { data: results, error: resultsError } = await supabase
					.from('test_results')
					.select('*')
					.eq('test_id', testId)
					.order('result_order');

				if (resultsError || !results?.length) {
					console.error('Error fetching test results:', resultsError);
					return null;
				}

				// 성별 필터링
				const genderFilteredResults = gender
					? results.filter((result: TestResult) => !result.target_gender || result.target_gender === gender)
					: results;

				// 점수 범위 매칭
				const matchByScore = (results: TestResult[]) => {
					for (const result of results) {
						if (result.match_conditions) {
							const conditions = result.match_conditions as IMatchConditions;
							const minScore = conditions.min ?? 0;
							const maxScore = conditions.max ?? Number.MAX_SAFE_INTEGER;

							if (totalScore >= minScore && totalScore <= maxScore) {
								return result;
							}
						}
					}
					return null;
				};

				// 성별 필터링된 결과에서 매칭 시도
				const matchedResult = matchByScore(genderFilteredResults);
				if (matchedResult) return matchedResult;

				// 폴백: 성별 무관하게 매칭
				if (gender && genderFilteredResults.length === 0) {
					const fallbackResult = matchByScore(results);
					if (fallbackResult) return fallbackResult;
				}

				// 최종 폴백: 첫 번째 결과
				return results[0];
			} catch (err) {
				console.error('Error finding matching result:', err);
				return null;
			}
		},
		[]
	);

	// 테스트 결과 저장
	const saveTestResult = useCallback(
		async (resultData: ITestResultData) => {
			try {
				setIsLoading(true);
				setError(null);

				// 1. 점수 계산
				const totalScore = await calculateScore(resultData.testId, resultData.answers);

				// 2. 결과 매칭
				const matchingResult = await findMatchingResult(resultData.testId, totalScore, resultData.gender);
				if (!matchingResult) {
					throw new Error('매칭되는 결과를 찾을 수 없습니다.');
				}

				// 3. 사용자 정보 가져오기
				const {
					data: { user },
				} = await supabase.auth.getUser();
				const sessionId = generateSessionId(user?.id);

				// 4. 응답 저장
				const { data: responseData, error: responseError } = await supabase
					.from('user_test_responses')
					.insert([
						{
							test_id: resultData.testId,
							user_id: user?.id || null,
							session_id: sessionId,
							result_id: matchingResult.id,
							total_score: totalScore,
							responses: resultData.answers,
							gender: resultData.gender || null,
							started_at: new Date(
								new Date(resultData.completedAt).getTime() - resultData.duration * 1000
							).toISOString(),
							completed_at: resultData.completedAt,
							completion_time_seconds: resultData.duration,
							created_date: new Date().toISOString().split('T')[0],
						},
					])
					.select()
					.single();

				if (responseError) {
					console.error('Error saving user response:', responseError);
					throw responseError;
				}

				// 5. 응답수 증가
				try {
					await supabase.rpc('increment_test_response', { test_uuid: resultData.testId });
				} catch (e) {
					console.warn('Failed to increment response_count:', e);
				}

				// 6. 세션 스토리지에 결과 저장
				const sessionData: ISessionData = {
					testId: resultData.testId,
					totalScore,
					resultId: matchingResult.id,
					resultName: matchingResult.result_name,
					description: matchingResult.description,
					features: (matchingResult.features as Record<string, unknown>) || {},
					completedAt: resultData.completedAt,
					duration: resultData.duration,
				};
				saveToSessionStorage(sessionData);

				return {
					...responseData,
					result: matchingResult,
				};
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '테스트 결과 저장에 실패했습니다.';
				setError(errorMessage);
				console.error('Error saving test result:', err);

				// 에러 발생 시 폴백 데이터 저장
				const fallbackData: ISessionData = {
					testId: resultData.testId,
					totalScore: 0,
					resultId: 'temp',
					resultName: '기본 결과',
					description: '결과를 불러오는 중 오류가 발생했습니다.',
					features: { error: ['오류 발생'] },
					completedAt: resultData.completedAt,
					duration: resultData.duration,
				};
				saveToSessionStorage(fallbackData);

				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[calculateScore, findMatchingResult]
	);

	return { isLoading, error, saveTestResult };
}
