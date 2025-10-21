'use client';

import { useState, useEffect, useCallback } from 'react';
import { testService } from '@/shared/api/services/test.service';
import { useAuthVM } from '@/features/auth';
import type { TestResult } from '@pickid/supabase';

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
	userName: string | null;
}

export function useTestResult({ testId }: UseTestResultProps): UseTestResultReturn {
	const [isLoading, setIsLoading] = useState(true);
	const [testResult, setTestResult] = useState<TestResult | null>(null);
	const [totalScore, setTotalScore] = useState<number>(0);
	const [userGender, setUserGender] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { isAuthenticated, user } = useAuthVM();

	const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || null;
	const isLoggedIn = isAuthenticated;

	// 테스트 결과 데이터 로드
	const loadResultData = useCallback(async () => {
		if (!testId) {
			setError('테스트 ID가 없습니다.');
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			// 응답 데이터와 결과 데이터를 병렬로 가져오기
			const [responseData, results] = await Promise.all([
				testService.getResponseData(testId),
				testService.getTestResultsByTestId(testId),
			]);

			const { responseData: userResponseData, totalScore, userGender } = responseData;
			const matchingResult = testService.findMatchingResult(userResponseData, results, totalScore, userGender);

			if (!matchingResult) {
				setError('테스트 결과를 찾을 수 없습니다.');
				return;
			}

			setTestResult(matchingResult);
			setTotalScore(totalScore);
			setUserGender(userGender);
		} catch {
			setError('결과를 불러오는 중 오류가 발생했습니다.');
		} finally {
			setIsLoading(false);
		}
	}, [testId]);

	useEffect(() => {
		loadResultData();
	}, [loadResultData]);

	return {
		testResult,
		totalScore,
		userGender,
		isLoading,
		error,
		isLoggedIn,
		userName,
	};
}
