'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@pickid/supabase';
import type { TestResult, UserTestResponse } from '@pickid/supabase';

interface UseTestResultProps {
	testId: string;
}

interface UseTestResultReturn {
	testResult: TestResult | null;
	totalScore: number;
	userGender: string | null;
	isLoading: boolean;
	error: string | null;
	isLoggedIn: boolean;
}

export function useTestResult({ testId }: UseTestResultProps): UseTestResultReturn {
	const [isLoading, setIsLoading] = useState(true);
	const [testResult, setTestResult] = useState<TestResult | null>(null);
	const [totalScore, setTotalScore] = useState<number>(0);
	const [userGender, setUserGender] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const loadResultData = async () => {
			if (!testId) {
				setError('테스트 ID가 없습니다.');
				setIsLoading(false);
				return;
			}

			try {
				const { responseData, totalScore, userGender } = await getResponseData(testId);
				const results = await getTestResults(testId);
				const matchingResult = findMatchingResult(responseData, results, totalScore, userGender);

				if (!matchingResult) {
					setError('테스트 결과를 찾을 수 없습니다.');
					setIsLoading(false);
					return;
				}

				setTestResult(matchingResult);
				setTotalScore(totalScore);
				setUserGender(userGender);
				setIsLoggedIn(!!localStorage.getItem('authToken'));
				setIsLoading(false);
			} catch (err) {
				console.error('Error loading result data:', err);
				setError('결과를 불러오는 중 오류가 발생했습니다.');
				setIsLoading(false);
			}
		};

		loadResultData();
	}, [testId]);

	return {
		testResult,
		totalScore,
		userGender,
		isLoading,
		error,
		isLoggedIn,
	};
}

// 세션 스토리지에서 응답 데이터 가져오기
async function getResponseData(testId: string) {
	let responseData: UserTestResponse | null = null;
	let totalScore = 0;
	let userGender: string | null = null;

	if (typeof window !== 'undefined') {
		const storedData = sessionStorage.getItem('testResult');
		if (storedData) {
			try {
				const parsedData = JSON.parse(storedData);
				if (parsedData.testId === testId && parsedData.resultId !== 'temp') {
					responseData = parsedData;
					totalScore = parsedData.totalScore || 0;
					userGender = parsedData.gender || null;
				}
			} catch (err) {
				console.warn('Failed to parse stored result data:', err);
			}
		}
	}

	if (!responseData) {
		const { data: userResponses } = await supabase
			.from('user_test_responses')
			.select('*')
			.eq('test_id', testId)
			.order('completed_at', { ascending: false })
			.limit(1);

		if (userResponses && userResponses.length > 0) {
			responseData = userResponses[0];
			totalScore = userResponses[0].total_score || 0;
			userGender = (userResponses[0] as { gender?: string })?.gender || null;
		}
	}

	return { responseData, totalScore, userGender };
}

// 테스트 결과 목록 가져오기
async function getTestResults(testId: string) {
	const { data: results, error: resultsError } = await supabase
		.from('test_results')
		.select('*')
		.eq('test_id', testId)
		.order('result_order');

	if (resultsError) {
		throw new Error('테스트 결과를 찾을 수 없습니다.');
	}

	return results || [];
}

// 결과 매칭 로직
function findMatchingResult(
	responseData: UserTestResponse | null,
	results: TestResult[],
	totalScore: number,
	userGender: string | null
): TestResult | null {
	// 세션 데이터에서 직접 결과가 있는 경우
	if (responseData && 'resultName' in responseData && responseData.resultName && responseData.result_id !== 'temp') {
		const sessionData = responseData as UserTestResponse & {
			resultName: string;
			result_id: string;
			description: string;
			features: Record<string, unknown>;
			theme_color: string;
			background_image_url: string;
		};

		return {
			id: sessionData.result_id,
			result_name: sessionData.resultName,
			description: sessionData.description,
			features: sessionData.features || {},
			theme_color: sessionData.theme_color || '#3B82F6',
			background_image_url: sessionData.background_image_url,
		} as TestResult;
	}

	// 성별 기반 결과 매칭
	const genderFilteredResults = userGender
		? results.filter((result: { target_gender?: string }) => {
				return !result.target_gender || result.target_gender === userGender;
		  })
		: results;

	// 점수 범위 매칭
	let matchingResult = findResultByScore(genderFilteredResults, totalScore);

	// 폴백: 성별 무관하게 점수만으로 매칭
	if (!matchingResult && userGender && genderFilteredResults.length === 0) {
		matchingResult = findResultByScore(results, totalScore);
	}

	// 최종 폴백: 첫 번째 결과
	if (!matchingResult && results.length > 0) {
		matchingResult = results[0];
	}

	return matchingResult as TestResult;
}

// 점수 범위로 결과 찾기
function findResultByScore(results: TestResult[], totalScore: number): TestResult | null {
	for (const result of results) {
		if (result.match_conditions) {
			const conditions = result.match_conditions as {
				min?: number;
				max?: number;
				min_score?: number;
				max_score?: number;
			};
			const minScore = conditions.min || conditions.min_score || 0;
			const maxScore = conditions.max || conditions.max_score || 999999;

			if (totalScore >= minScore && totalScore <= maxScore) {
				return result;
			}
		}
	}
	return null;
}
