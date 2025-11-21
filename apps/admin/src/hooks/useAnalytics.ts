import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services';
import { queryKeys } from '@/shared/lib/query-client';
import type { AnalyticsFilters } from '@pickid/supabase';

export const useAnalytics = (filters: AnalyticsFilters = {}) => {
	// 테스트 목록 조회
	const testsQuery = useQuery({
		queryKey: queryKeys.analytics.testStats('all'),
		queryFn: () => analyticsService.getAllTestsForAnalytics(),
		staleTime: 2 * 60 * 1000,
	});

	// 필터링된 테스트
	const filteredTests = useMemo(() => {
		const tests = testsQuery.data || [];
		return tests.filter((test) => {
			const matchesSearch =
				!filters.search ||
				test.title.toLowerCase().includes(filters.search.toLowerCase()) ||
				test.description?.toLowerCase().includes(filters.search.toLowerCase());
			const matchesStatus = !filters.status || filters.status === 'all' || test.status === filters.status;
			return matchesSearch && matchesStatus;
		});
	}, [testsQuery.data, filters]);

	// 대시보드 통계 조회
	const statsQuery = useQuery({
		queryKey: queryKeys.analytics.dashboard(),
		queryFn: () => analyticsService.getDashboardOverviewStats(),
		staleTime: 5 * 60 * 1000,
	});

	return {
		tests: filteredTests,
		loading: testsQuery.isLoading || statsQuery.isLoading,
		error: testsQuery.error?.message || statsQuery.error?.message || null,
		stats: statsQuery.data || {
			total: 0,
			published: 0,
			draft: 0,
			scheduled: 0,
			totalResponses: 0,
			totalCompletions: 0,
			completionRate: 0,
			avgCompletionTime: 0,
			anomalies: 0,
		},
	};
};
