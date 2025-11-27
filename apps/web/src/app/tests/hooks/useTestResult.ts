'use client';

import { useEffect, useState, useRef } from 'react';
import { testResultService } from '@/api/services/test-result.service';
import { preloadImage } from '@/lib/image-preload';
import type { TestResult } from '@pickid/supabase';

interface IUseTestResultProps {
	testId: string;
	enabled?: boolean;
}

// 심리테스트 결과 로드 훅
// - 세션 스토리지에서 응답 데이터 조회
// - 결과 매칭 및 로드
// - 결과 이미지 프리로드 (로딩 화면 동안)
//
// Note: 사용자 정보는 컴포넌트에서 useAuth 직접 호출
export function useTestResult({ testId, enabled = true }: IUseTestResultProps) {
	const [isLoading, setIsLoading] = useState(enabled);
	const [testResult, setTestResult] = useState<TestResult | null>(null);
	const [totalScore, setTotalScore] = useState<number>(0);
	const [userGender, setUserGender] = useState<string | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const hasLoadedRef = useRef(false);

	useEffect(() => {
		// enabled가 false면 실행하지 않음
		if (!enabled) {
			setIsLoading(false);
			return;
		}

		// 이미 로드했다면 다시 로드하지 않음 (프로그레스바 중복 실행 방지)
		if (hasLoadedRef.current) return;

		async function loadResultData() {
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

				// 결과 이미지 즉시 프리로드 (로딩 화면 표시 중에 이미지 로드 시작)
				if (matchingResult.background_image_url) {
					preloadImage(matchingResult.background_image_url);
				}

				setTestResult(matchingResult);
				setTotalScore(totalScore);
				setUserGender(gender);
				hasLoadedRef.current = true;
			} catch (err) {
				setError(err instanceof Error ? err : new Error('결과를 불러오는 중 오류가 발생했습니다.'));
			} finally {
				setIsLoading(false);
			}
		}

		loadResultData();
	}, [testId, enabled]);

	return { testResult, totalScore, userGender, isLoading, error };
}
