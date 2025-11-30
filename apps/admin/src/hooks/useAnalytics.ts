import { queryKeys } from '@pickid/shared';
import { analyticsService } from '@/services';
import type { AnalyticsFilters } from '@pickid/supabase';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useAnalytics = (filters: AnalyticsFilters = {}) => {
	const testsQuery = useQuery({
		queryKey: queryKeys.analytics.testStats('all'),
		queryFn: () => analyticsService.getAllTestsForAnalytics(),
		staleTime: 2 * 60 * 1000,
	});

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

	const statsQuery = useQuery({
		queryKey: queryKeys.analytics.dashboard(),
		queryFn: () => analyticsService.getDashboardOverviewStats(),
		staleTime: 5 * 60 * 1000,
	});

	return {
		tests: filteredTests,
		loading: testsQuery.isLoading || statsQuery.isLoading,
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
