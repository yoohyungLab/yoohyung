import { useState, useCallback, useEffect } from 'react';
import { testService } from '@/shared/api';

export function useHome() {
	const [tests, setTests] = useState<unknown[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 공개된 테스트 조회
	const loadPublishedTests = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const publishedTests = await testService.getPublishedTests();
			setTests(publishedTests);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '테스트를 불러오는데 실패했습니다.';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// 특정 테스트 조회
	const getTestBySlug = useCallback(async (slug: string) => {
		try {
			setIsLoading(true);
			setError(null);

			const test = await testService.getTestBySlug(slug);
			return test;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '테스트를 불러오는데 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadPublishedTests();
	}, [loadPublishedTests]);

	return {
		tests,
		isLoading,
		error,
		loadPublishedTests,
		getTestBySlug,
	};
}
