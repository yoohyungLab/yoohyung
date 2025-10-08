import { useState, useCallback, useEffect, useMemo } from 'react';
import { testService } from '@/shared/api';
import type { Test, TestWithDetails, TestFilters, TestStats } from '@pickid/supabase';

export const useTests = () => {
	const [tests, setTests] = useState<Test[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<TestFilters>({
		search: '',
		status: 'all',
	});

	// 필터링된 테스트
	const filteredTests = useMemo(() => {
		return tests.filter((test) => {
			const matchesSearch = filters.search === '' || test.title.toLowerCase().includes(filters.search.toLowerCase());
			const matchesStatus = filters.status === 'all' || test.status === filters.status;
			return matchesSearch && matchesStatus;
		});
	}, [tests, filters]);

	// UI용 데이터 변환
	const uiTests = useMemo(() => {
		return filteredTests.map(
			(test): TestWithDetails => ({
				...test,
				category_name: '기타',
				emoji: '📝',
				status: test.status || 'draft',
				type: test.type || 'psychology',
				thumbnailImage: test.thumbnail_url || '',
				startMessage: '',
				scheduledAt: test.scheduled_at || '',
				responseCount: test.response_count || 0,
				completionRate: 0,
				estimatedTime: test.estimated_time || 5,
				share_count: 0,
				completion_count: 0,
				createdBy: '',
				createdAt: test.created_at,
				updatedAt: test.updated_at,
				isPublished: test.status === 'published',
				question_count: 0,
				result_count: 0,
				response_count: test.response_count || 0,
				questions: [],
				results: [],
			})
		);
	}, [filteredTests]);

	// 통계 계산
	const stats = useMemo((): TestStats => {
		if (tests.length === 0) {
			return {
				total: 0,
				published: 0,
				draft: 0,
				scheduled: 0,
				responses: 0,
			};
		}

		return {
			total: tests.length,
			published: tests.filter((test) => test.status === 'published').length,
			draft: tests.filter((test) => test.status === 'draft').length,
			scheduled: tests.filter((test) => test.status === 'scheduled').length,
			responses: tests.reduce((sum, test) => sum + (test.response_count || 0), 0),
		};
	}, [tests]);

	// 데이터 로딩
	const loadTests = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await testService.getTests();
			setTests(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : '테스트를 불러오는데 실패했습니다.');
		} finally {
			setLoading(false);
		}
	}, []);

	// 상태 변경
	const togglePublishStatus = useCallback(
		async (id: string, isPublished?: boolean) => {
			try {
				const test = tests.find((t) => t.id === id);
				if (!test) return;

				const newStatus =
					isPublished !== undefined
						? isPublished
							? 'published'
							: 'draft'
						: test.status === 'published'
						? 'draft'
						: 'published';

				await testService.updateTestStatus(id, newStatus);
				setTests((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
			} catch (err) {
				setError(err instanceof Error ? err.message : '상태 변경에 실패했습니다.');
			}
		},
		[tests]
	);

	// 삭제
	const deleteTest = useCallback(async (id: string) => {
		try {
			await testService.deleteTest(id);
			setTests((prev) => prev.filter((test) => test.id !== id));
		} catch (err) {
			setError(err instanceof Error ? err.message : '테스트 삭제에 실패했습니다.');
		}
	}, []);

	// 필터 업데이트
	const updateFilters = useCallback((newFilters: Partial<TestFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	// 초기 로딩
	useEffect(() => {
		loadTests();
	}, [loadTests]);

	return {
		tests: uiTests,
		loading,
		error,
		filters,
		stats,
		togglePublishStatus,
		deleteTest,
		updateFilters,
	};
};
