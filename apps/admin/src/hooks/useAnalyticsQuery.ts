import { analyticsService } from '@/shared/api';
import { queryKeys } from '@/shared/lib/query-client';
import type { AnalyticsFilters } from '@repo/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// 모든 테스트 목록 조회 쿼리
export const useAnalyticsTests = (filters: AnalyticsFilters = {}) => {
	return useQuery({
		queryKey: queryKeys.analytics.testStats('all'),
		queryFn: () => analyticsService.getAllTestsForAnalytics(),
		select: (data) => {
			// 클라이언트 사이드 필터링
			return data.filter((test) => {
				const matchesSearch =
					!filters.search ||
					test.title.toLowerCase().includes(filters.search.toLowerCase()) ||
					test.description?.toLowerCase().includes(filters.search.toLowerCase());

				const matchesStatus = filters.status === 'all' || test.status === filters.status;
				const matchesCategory = filters.category === 'all';

				return matchesSearch && matchesStatus && matchesCategory;
			});
		},
		staleTime: 2 * 60 * 1000, // 2분
		gcTime: 5 * 60 * 1000, // 5분
	});
};

// 대시보드 통계 조회 쿼리
export const useDashboardStats = () => {
	return useQuery({
		queryKey: queryKeys.analytics.dashboard(),
		queryFn: () => analyticsService.getDashboardOverviewStats(),
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 10 * 60 * 1000, // 10분
	});
};

// 테스트별 상세 통계 조회 쿼리
export const useTestDetailedStats = (testId: string) => {
	return useQuery({
		queryKey: queryKeys.analytics.testStats(testId),
		queryFn: () => analyticsService.getTestDetailedStats(testId),
		enabled: !!testId,
		staleTime: 3 * 60 * 1000, // 3분
		gcTime: 10 * 60 * 1000, // 10분
	});
};

// 테스트별 기본 통계 조회 쿼리
export const useTestBasicStats = (testId: string) => {
	return useQuery({
		queryKey: queryKeys.analytics.testStats(testId),
		queryFn: () => analyticsService.getTestBasicStats(testId),
		enabled: !!testId,
		staleTime: 3 * 60 * 1000, // 3분
		gcTime: 10 * 60 * 1000, // 10분
	});
};

// 테스트별 분석 데이터 조회 쿼리
export const useTestAnalyticsData = (testId: string) => {
	return useQuery({
		queryKey: queryKeys.analytics.testAnalytics(testId),
		queryFn: () => analyticsService.getTestAnalyticsData(testId),
		enabled: !!testId,
		staleTime: 3 * 60 * 1000, // 3분
		gcTime: 10 * 60 * 1000, // 10분
	});
};

// 테스트별 트렌드 데이터 조회 쿼리
export const useTestTrendsData = (testId: string, daysBack: number = 30) => {
	return useQuery({
		queryKey: queryKeys.analytics.testTrends(testId, daysBack),
		queryFn: () => analyticsService.getTestTrendsData(testId, daysBack),
		enabled: !!testId,
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 15 * 60 * 1000, // 15분
	});
};

// 테스트별 세그먼트 데이터 조회 쿼리
export const useTestSegmentsData = (testId: string) => {
	return useQuery({
		queryKey: queryKeys.analytics.testSegments(testId),
		queryFn: () => analyticsService.getTestSegmentsData(testId),
		enabled: !!testId,
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 15 * 60 * 1000, // 15분
	});
};

// 테스트별 퍼널 데이터 조회 쿼리
export const useTestFunnelData = (testId: string) => {
	return useQuery({
		queryKey: queryKeys.analytics.testFunnel(testId),
		queryFn: () => analyticsService.getTestFunnelData(testId),
		enabled: !!testId,
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 15 * 60 * 1000, // 15분
	});
};

// 테스트별 품질 지표 조회 쿼리
export const useTestQualityMetrics = (testId: string) => {
	return useQuery({
		queryKey: queryKeys.analytics.testQuality(testId),
		queryFn: () => analyticsService.getTestQualityMetrics(testId),
		enabled: !!testId,
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 15 * 60 * 1000, // 15분
	});
};

// 카테고리별 통계 조회 쿼리
export const useCategoryStats = () => {
	return useQuery({
		queryKey: queryKeys.analytics.categoryStats(),
		queryFn: () => analyticsService.getCategoryStats(),
		staleTime: 10 * 60 * 1000, // 10분
		gcTime: 30 * 60 * 1000, // 30분
	});
};

// 응답 차트 데이터 조회 쿼리
export const useResponsesChartData = (testId?: string, daysBack: number = 30) => {
	return useQuery({
		queryKey: queryKeys.analytics.testStats(testId || 'all'),
		queryFn: () => analyticsService.getResponsesChartData(testId, daysBack),
		staleTime: 3 * 60 * 1000, // 3분
		gcTime: 10 * 60 * 1000, // 10분
	});
};

// 사용자 응답 통계 조회 쿼리
export const useUserResponseStats = (filters: any = {}) => {
	return useQuery({
		queryKey: queryKeys.analytics.testStats('user-responses'),
		queryFn: () => analyticsService.getUserResponseStats(filters),
		staleTime: 3 * 60 * 1000, // 3분
		gcTime: 10 * 60 * 1000, // 10분
	});
};

// 기존 useAnalytics와 호환되는 훅 (점진적 마이그레이션용)
export const useAnalytics = () => {
	const testsQuery = useAnalyticsTests();
	const statsQuery = useDashboardStats();

	return {
		// 데이터
		tests: testsQuery.data || [],
		loading: testsQuery.isLoading || statsQuery.isLoading,
		error: testsQuery.error || statsQuery.error,
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

		// 액션들
		loadData: () => {
			testsQuery.refetch();
			statsQuery.refetch();
		},

		handleExport: async () => {
			console.log('Exporting data...');
		},
		handleBulkAction: async (action: string, selectedTests: string[]) => {
			console.log(`Bulk action: ${action}`, selectedTests);
		},
		updateFilters: () => {
			// 필터는 쿼리 키에 포함되어 자동으로 처리됨
		},
		updateSelectedTests: () => {
			// 선택된 테스트는 로컬 상태로 관리
		},
		clearSelectedTests: () => {
			// 선택된 테스트는 로컬 상태로 관리
		},
	};
};

// 분석 캐시 무효화 훅
export const useInvalidateAnalyticsCache = () => {
	const queryClient = useQueryClient();

	const invalidateAll = () => {
		queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
	};

	const invalidateTestStats = (testId?: string) => {
		queryClient.invalidateQueries({ queryKey: queryKeys.analytics.testStats(testId) });
	};

	const invalidateDashboard = () => {
		queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
	};

	const invalidateCategoryStats = () => {
		queryClient.invalidateQueries({ queryKey: queryKeys.analytics.categoryStats() });
	};

	return {
		invalidateAll,
		invalidateTestStats,
		invalidateDashboard,
		invalidateCategoryStats,
	};
};
