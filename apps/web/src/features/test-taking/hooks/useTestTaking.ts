import { useState, useCallback } from 'react';
import { testService } from '@/shared/api';
import type { TestResultData } from '@/shared/api';
import type { TestResultInsert } from '@repo/supabase';

export function useTestTaking() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 테스트 결과 저장
	const saveTestResult = useCallback(async (data: TestResultData) => {
		try {
			setIsLoading(true);
			setError(null);

			// TestResultData를 TestResultInsert로 변환
			const testResultInsert: TestResultInsert = {
				result_name: data.result,
				result_order: 1, // 기본값
				description: `결과: ${data.result}`,
				created_at: new Date().toISOString(),
			};

			const result = await testService.saveTestResult(testResultInsert);

			return result;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '테스트 결과 저장에 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	// 사용자 응답 저장
	const saveUserResponse = useCallback(
		async (
			testId: string,
			userId: string | null,
			responses: Record<string, unknown>,
			resultId?: string,
			score?: number,
			startedAt?: string,
			completedAt?: string
		) => {
			try {
				setIsLoading(true);
				setError(null);

				const result = await testService.saveUserResponse(
					testId,
					userId,
					responses,
					resultId,
					score,
					startedAt,
					completedAt
				);

				return result;
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '사용자 응답 저장에 실패했습니다.';
				setError(errorMessage);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		isLoading,
		error,
		saveTestResult,
		saveUserResponse,
	};
}
