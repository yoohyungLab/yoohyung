'use client';

import { useCallback, useEffect, useState } from 'react';
import { testResultService } from '@/api/services/test-result.service';
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
	const [error, setError] = useState<Error | null>(null);

	const loadResultData = useCallback(async () => {
		if (!testId) {
			setError(new Error('테스트 ID가 없습니다.'));
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			const [responseData, results] = await Promise.all([
				testResultService.getResponseData(testId),
				testResultService.getTestResultsByTestId(testId),
			]);

			if (!responseData || !responseData.answers) {
				setError(new Error('테스트 응답 데이터를 찾을 수 없습니다.'));
				setIsLoading(false);
				return;
			}

			const answers = responseData.answers as Array<{ questionId: string; choiceId: string; code?: string }>;
			const totalScore = responseData.total_score || 0;
			const gender = responseData.gender || null;

			const matchingResult = await testResultService.findMatchingResult(results, totalScore, answers, gender);

			if (!matchingResult) {
				setError(new Error('테스트 결과를 찾을 수 없습니다.'));
				return;
			}

			setTestResult(matchingResult);
			setTotalScore(totalScore);
			setUserGender(gender);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('결과를 불러오는 중 오류가 발생했습니다.'));
		} finally {
			setIsLoading(false);
		}
	}, [testId]);

	useEffect(() => {
		loadResultData();
	}, [loadResultData]);

	return { testResult, totalScore, userGender, isLoading, error };
}
