import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { analyticsService } from '@/shared/api';
import { queryKeys } from '@/shared/lib/query-client';
import type { AnalyticsFilters } from '@pickid/supabase';

export const useAnalytics = (filters: AnalyticsFilters = {}) => {
	const [selectedTests, setSelectedTests] = useState<string[]>([]);
	const queryClient = useQueryClient();

	// 테스트 목록 조회
	const testsQuery = useQuery({
		queryKey: queryKeys.analytics.testStats('all'),
		queryFn: () => analyticsService.getAllTestsForAnalytics(),
		select: (data) =>
			data.filter((test) => {
				const matchesSearch =
					!filters.search ||
					test.title.toLowerCase().includes(filters.search.toLowerCase()) ||
					test.description?.toLowerCase().includes(filters.search.toLowerCase());
				const matchesStatus = filters.status === 'all' || test.status === filters.status;
				const matchesCategory = filters.category === 'all';
				return matchesSearch && matchesStatus && matchesCategory;
			}),
		staleTime: 2 * 60 * 1000,
	});

	// 대시보드 통계 조회
	const statsQuery = useQuery({
		queryKey: queryKeys.analytics.dashboard(),
		queryFn: () => analyticsService.getDashboardOverviewStats(),
		staleTime: 5 * 60 * 1000,
	});

	// 테스트 상세 통계 조회
	const useTestDetailedStats = (testId: string) => {
		return useQuery({
			queryKey: queryKeys.analytics.testStats(testId),
			queryFn: () => analyticsService.getTestDetailedStats(testId),
			enabled: !!testId,
			staleTime: 3 * 60 * 1000,
		});
	};

	// 테스트 트렌드 데이터 조회
	const useTestTrendsData = (testId: string, daysBack: number = 30) => {
		return useQuery({
			queryKey: queryKeys.analytics.testTrends(testId, daysBack),
			queryFn: () => analyticsService.getTestTrendsData(testId, daysBack),
			enabled: !!testId,
			staleTime: 5 * 60 * 1000,
		});
	};

	// 카테고리 통계 조회
	const useCategoryStats = () => {
		return useQuery({
			queryKey: queryKeys.analytics.categoryStats(),
			queryFn: () => analyticsService.getCategoryStats(),
			staleTime: 10 * 60 * 1000,
		});
	};

	// 액션들
	const handleBulkAction = useCallback(
		(action: string) => {
			console.log(`Bulk action: ${action}`, selectedTests);
			setSelectedTests([]);
		},
		[selectedTests]
	);

	// 캐시 무효화
	const invalidateCache = {
		invalidateAll: () => queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all }),
		invalidateTestStats: (testId?: string) =>
			queryClient.invalidateQueries({ queryKey: queryKeys.analytics.testStats(testId || 'all') }),
		invalidateDashboard: () => queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() }),
	};

	return {
		// 데이터
		tests: testsQuery.data || [],
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
		selectedTests,
		filters,

		// 액션들
		handleBulkAction,
		updateSelectedTests: setSelectedTests,
		clearSelectedTests: () => setSelectedTests([]),

		// 추가 쿼리 훅들
		useTestDetailedStats,
		useTestTrendsData,
		useCategoryStats,

		// 캐시 관리
		invalidateCache,
	};
};
