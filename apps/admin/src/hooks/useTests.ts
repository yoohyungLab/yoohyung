import { useState, useCallback, useEffect } from 'react';
import { testService } from '@/shared/api';
import type { TestWithDetails, TestInsert, TestUpdate } from '@repo/supabase';

/**
 * 기존 테스트들의 CRUD 관리 훅
 * @returns 테스트 목록, 로딩상태, CRUD 메서드들
 */
export const useTests = () => {
	// 기본 상태
	const [tests, setTests] = useState<TestWithDetails[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 자동으로 모든 테스트 로드
	useEffect(() => {
		const loadInitialData = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await testService.getAllTests();
				setTests(data);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '테스트를 불러오는데 실패했습니다.';
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		loadInitialData();
	}, []);

	// 기본 CRUD 메서드들
	const fetchTests = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await testService.getAllTests();
			setTests(data);
			return data;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '테스트를 불러오는데 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchTest = useCallback(async (id: string) => {
		try {
			setLoading(true);
			setError(null);
			const data = await testService.getTestById(id);
			return data;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '테스트를 불러오는데 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const createTest = useCallback(async (testData: TestInsert) => {
		try {
			setLoading(true);
			setError(null);
			const newTest = await testService.createTest(testData);
			setTests((prev) => [...prev, newTest]);
			return newTest;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '테스트 생성에 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateTest = useCallback(async (id: string, testData: TestUpdate) => {
		try {
			setLoading(true);
			setError(null);
			const updatedTest = await testService.updateTest(id, testData);
			setTests((prev) => prev.map((test) => (test.id === id ? updatedTest : test)));
			return updatedTest;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '테스트 수정에 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const deleteTest = useCallback(async (id: string) => {
		try {
			setLoading(true);
			setError(null);
			await testService.deleteTest(id);
			setTests((prev) => prev.filter((test) => test.id !== id));
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '테스트 삭제에 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const togglePublishStatus = useCallback(async (id: string, isPublished?: boolean) => {
		try {
			await testService.togglePublishStatus(id, isPublished);
			setTests((prev) =>
				prev.map((test) => (test.id === id ? { ...test, updated_at: new Date().toISOString() } : test))
			);
		} catch (err) {
			console.error('게시 상태 변경 실패:', err);
		}
	}, []);

	const incrementViewCount = useCallback(async (id: string) => {
		try {
			await testService.incrementViewCount(id);
			setTests((prev) =>
				prev.map((test) => (test.id === id ? { ...test, view_count: (test.view_count || 0) + 1 } : test))
			);
		} catch (err) {
			console.error('조회수 증가 실패:', err);
		}
	}, []);

	const incrementShareCount = useCallback(async (id: string) => {
		try {
			await testService.incrementShareCount(id);
			setTests((prev) =>
				prev.map((test) => (test.id === id ? { ...test, share_count: (test.share_count || 0) + 1 } : test))
			);
		} catch (err) {
			console.error('공유수 증가 실패:', err);
		}
	}, []);

	return {
		tests,
		loading,
		error,
		fetchTests,
		fetchTest,
		createTest,
		updateTest,
		deleteTest,
		togglePublishStatus,
		incrementViewCount,
		incrementShareCount,
	};
};
