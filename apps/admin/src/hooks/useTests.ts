/**
 * @hook useTests
 * @description 테스트 목록 관리 훅
 */

import { useState, useCallback, useMemo } from 'react';
import { useTestList } from './useTestList';
import { useUpdateTestStatus } from './useUpdateTestStatus';
import { useDeleteTest } from './useDeleteTest';
import type { TestFilters, TestStats } from '@pickid/supabase';

export const useTests = () => {
	// React Query로 테스트 목록 조회
	const { data: tests = [], isLoading: loading, error: queryError } = useTestList();

	// Mutations
	const updateStatusMutation = useUpdateTestStatus();
	const deleteTestMutation = useDeleteTest();

	// Local state
	const [filters, setFilters] = useState<TestFilters>({
		search: '',
		status: 'all',
	});

	// 에러 상태 처리
	const error = queryError ? (queryError instanceof Error ? queryError.message : '테스트를 불러오는데 실패했습니다.') : null;

	// 필터링된 테스트
	const filteredTests = useMemo(() => {
		return tests.filter((test) => {
			const matchesSearch =
				filters.search === '' || test.title.toLowerCase().includes((filters.search || '').toLowerCase());
			const matchesStatus = filters.status === 'all' || test.status === filters.status;
			return matchesSearch && matchesStatus;
		});
	}, [tests, filters]);

	// 통계 계산 (클라이언트 메모이제이션)
	const stats = useMemo((): TestStats => {
		if (tests.length === 0) {
			return {
				total: 0,
				published: 0,
				draft: 0,
				scheduled: 0,
				archived: 0,
				responses: 0,
			};
		}

		return {
			total: tests.length,
			published: tests.filter((test) => test.status === 'published').length,
			draft: tests.filter((test) => test.status === 'draft').length,
			scheduled: tests.filter((test) => test.status === 'scheduled').length,
			archived: tests.filter((test) => test.status === 'archived').length,
			responses: tests.reduce((sum, test) => sum + (test.response_count || 0), 0),
		};
	}, [tests]);

	// 상태 변경 (React Query Mutation 사용)
	const togglePublishStatus = useCallback(
		async (id: string, isPublished?: boolean) => {
			const test = tests.find((t) => t.id === id);
			if (!test) return;

			const newStatus =
				isPublished !== undefined ? (isPublished ? 'published' : 'draft') : test.status === 'published' ? 'draft' : 'published';

			await updateStatusMutation.mutateAsync({ id, status: newStatus });
		},
		[tests, updateStatusMutation]
	);

	// 삭제 (React Query Mutation 사용)
	const deleteTest = useCallback(
		async (id: string) => {
			await deleteTestMutation.mutateAsync(id);
		},
		[deleteTestMutation]
	);

	// 필터 업데이트
	const updateFilters = useCallback((newFilters: Partial<TestFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	return {
		tests: filteredTests,
		loading,
		error,
		filters,
		stats,
		togglePublishStatus,
		deleteTest,
		updateFilters,
	};
};
