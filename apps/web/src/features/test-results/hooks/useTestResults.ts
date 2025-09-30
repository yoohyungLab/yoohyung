import { useState, useCallback, useEffect } from 'react';
import { testService } from '@/shared/api';

export function useTestResults() {
	const [testResults, setTestResults] = useState<unknown[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 테스트 결과 조회
	const loadTestResults = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const results = await testService.getTestResults();
			setTestResults(results);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '테스트 결과를 불러오는데 실패했습니다.';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// 사용자별 응답 조회
	const getUserResponse = useCallback(async (userId: string, testId: string) => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await testService.getUserResponseByUser(userId, testId);
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '사용자 응답을 불러오는데 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	// 세션별 응답 조회
	const getSessionResponse = useCallback(async (sessionId: string, testId: string) => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await testService.getUserResponseBySession(sessionId, testId);
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '세션 응답을 불러오는데 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadTestResults();
	}, [loadTestResults]);

	return {
		testResults,
		isLoading,
		error,
		loadTestResults,
		getUserResponse,
		getSessionResponse,
	};
}
