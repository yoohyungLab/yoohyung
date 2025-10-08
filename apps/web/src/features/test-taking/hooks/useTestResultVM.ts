'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@pickid/shared';
import type { TestAnswer } from '@/shared/types';
import type { TestResult } from '@pickid/supabase';

/**
 * 테스트 결과 ViewModel
 * - 사용자 응답 저장
 * - 점수 계산 및 결과 매칭
 * - 통계 업데이트
 * - 도메인 규칙 적용
 */
export function useTestResultVM() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 점수 계산 함수
	const calculateScore = useCallback(async (testId: string, answers: TestAnswer[]): Promise<number> => {
		try {
			let totalScore = 0;

			// 각 답변에 대해 점수 계산
			for (const answer of answers) {
				const { data: choiceData, error: choiceError } = await supabase
					.from('test_choices')
					.select('score')
					.eq('id', answer.choiceId)
					.single();

				if (choiceError) {
					console.error('Error fetching choice score for choiceId:', answer.choiceId, choiceError);
					continue;
				}

				const score = choiceData.score || 0;
				totalScore += score;
			}

			return totalScore;
		} catch (err) {
			console.error('Error calculating score:', err);
			return 0;
		}
	}, []);

	// 결과 매칭 함수
	const findMatchingResult = useCallback(async (testId: string, totalScore: number): Promise<TestResult | null> => {
		try {
			// 해당 테스트의 모든 결과 조회
			const { data: results, error: resultsError } = await supabase
				.from('test_results')
				.select('*')
				.eq('test_id', testId)
				.order('result_order');

			if (resultsError) {
				console.error('Error fetching test results:', resultsError);
				return null;
			}

			// 점수 범위에 맞는 결과 찾기
			for (const result of results) {
				if (result.match_conditions) {
					const conditions = result.match_conditions as { min_score?: number; max_score?: number };
					const minScore = conditions.min_score || 0;
					const maxScore = conditions.max_score || 999999;

					if (totalScore >= minScore && totalScore <= maxScore) {
						return result;
					}
				}
			}

			// 기본적으로 첫 번째 결과 반환
			return results[0] || null;
		} catch (err) {
			console.error('Error finding matching result:', err);
			return null;
		}
	}, []);

	// 테스트 결과 저장
	const saveTestResult = useCallback(
		async (resultData: {
			testId: string;
			answers: TestAnswer[];
			completedAt: string;
			duration: number;
			gender?: string;
		}) => {
			try {
				setIsLoading(true);
				setError(null);

				// 1. 점수 계산
				const totalScore = await calculateScore(resultData.testId, resultData.answers);

				// 2. 결과 매칭
				const matchingResult = await findMatchingResult(resultData.testId, totalScore);
				if (!matchingResult) {
					throw new Error('매칭되는 결과를 찾을 수 없습니다.');
				}

				// 3. 현재 사용자 정보 가져오기
				const {
					data: { user },
				} = await supabase.auth.getUser();

				// 4. 세션 ID 생성 (익명 사용자용)
				const sessionId = user?.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

				// 5. 사용자 응답 저장
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

				// 6. 테스트 조회수 업데이트 (선택사항)
				try {
					await supabase
						.from('tests')
						.update({ view_count: supabase.raw('view_count + 1') })
						.eq('id', resultData.testId);
				} catch (updateError) {
					console.warn('Failed to update view count:', updateError);
				}

				// 7. 세션 스토리지에 결과 저장 (결과 페이지에서 사용)
				if (typeof window !== 'undefined') {
					const sessionData = {
						testId: resultData.testId,
						totalScore: totalScore,
						resultId: matchingResult.id,
						resultName: matchingResult.result_name,
						description: matchingResult.description,
						features: matchingResult.features,
						completedAt: resultData.completedAt,
						duration: resultData.duration,
					};
					sessionStorage.setItem('testResult', JSON.stringify(sessionData));
				}

				return {
					...responseData,
					result: matchingResult,
				};
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '테스트 결과 저장에 실패했습니다.';
				setError(errorMessage);
				console.error('Error saving test result:', err);

				// 에러가 발생해도 기본 결과를 세션 스토리지에 저장
				if (typeof window !== 'undefined') {
					const fallbackData = {
						testId: resultData.testId,
						totalScore: 0,
						resultId: 'temp',
						resultName: '기본 결과',
						description: '결과를 불러오는 중 오류가 발생했습니다.',
						features: ['오류 발생'],
						completedAt: resultData.completedAt,
						duration: resultData.duration,
					};
					sessionStorage.setItem('testResult', JSON.stringify(fallbackData));
				}

				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[calculateScore, findMatchingResult]
	);

	return { isLoading, error, saveTestResult };
}
