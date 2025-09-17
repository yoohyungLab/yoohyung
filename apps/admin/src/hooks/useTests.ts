import { useState, useCallback } from 'react';
import { testService } from '../api/test.service';
import type { TestWithDetails, TestFilters } from '../api/test.service';

export const useTests = () => {
    const [tests, setTests] = useState<TestWithDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTests = useCallback(async (filters?: TestFilters) => {
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

    const createTest = useCallback(async (testData: Omit<TestWithDetails, 'id' | 'created_at' | 'updated_at'>) => {
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

    const updateTest = useCallback(async (id: string, testData: Partial<TestWithDetails>) => {
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

    const incrementViewCount = useCallback(async (id: string) => {
        try {
            await testService.incrementViewCount(id);
            setTests((prev) => prev.map((test) => (test.id === id ? { ...test, view_count: (test.view_count || 0) + 1 } : test)));
        } catch (err) {
            console.error('조회수 증가 실패:', err);
        }
    }, []);

    const incrementShareCount = useCallback(async (id: string) => {
        try {
            await testService.incrementShareCount(id);
            setTests((prev) => prev.map((test) => (test.id === id ? { ...test, share_count: (test.share_count || 0) + 1 } : test)));
        } catch (err) {
            console.error('공유수 증가 실패:', err);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
        tests,
        loading,
        error,
        fetchTests,
        fetchTest,
        createTest,
        updateTest,
        deleteTest,
        incrementViewCount,
        incrementShareCount,
        clearError,
    };
};
