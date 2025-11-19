'use client';

import { useCallback, useEffect, useState } from 'react';
import { testService } from '@/shared/api/services/test.service';
import type { TestResult } from '@pickid/supabase';

interface IUseTestResultProps {
	testId: string;
}

/**
 * 심리테스트 결과 로드 훅
 * - 세션 스토리지에서 응답 데이터 조회
 * - 결과 매칭 및 로드
 *
 * Note: 사용자 정보는 컴포넌트에서 useAuth 직접 호출
 */
export function useTestResult({ testId }: IUseTestResultProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [testResult, setTestResult] = useState<TestResult | null>(null);
	const [totalScore, setTotalScore] = useState<number>(0);
	const [userGender, setUserGender] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const loadResultData = useCallback(async () => {
		if (!testId) {
			setError('테스트 ID가 없습니다.');
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			const [responseData, results] = await Promise.all([
				testService.getResponseData(testId),
				testService.getTestResultsByTestId(testId),
			]);

			const { responseData: userResponseData, totalScore, userGender, codes } = responseData;
			const matchingResult = testService.findMatchingResult(userResponseData, results, totalScore, userGender, codes);

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

	return { testResult, totalScore, userGender, isLoading, error };
}
