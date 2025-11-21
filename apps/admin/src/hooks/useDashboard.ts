import { useQuery } from '@tanstack/react-query';
import { analyticsService, dashboardService } from '@/services';
import { queryKeys } from '@/shared/lib/query-client';


export const useDashboard = () => {
	const statsQuery = useQuery({
		queryKey: queryKeys.analytics.dashboard(),
		queryFn: () => analyticsService.getDashboardOverviewStats(),
		staleTime: 5 * 60 * 1000,
	});

	const topTestsQuery = useQuery({
		queryKey: queryKeys.analytics.topTests(3),
		queryFn: () => dashboardService.getTopTestsToday(3),
		staleTime: 5 * 60 * 1000,
	});

	const stats = statsQuery.data || {
		total: 0,
		published: 0,
		draft: 0,
		scheduled: 0,
		totalResponses: 0,
		totalCompletions: 0,
		completionRate: 0,
		avgCompletionTime: 0,
		anomalies: 0,
	};

	return {
		stats: {
			totalTests: stats.total,
			publishedTests: stats.published,
			draftTests: stats.draft,
			scheduledTests: stats.scheduled,
			todayResponses: stats.totalResponses,
			todayVisitors: stats.totalCompletions,
			weeklyCompletionRate: stats.completionRate,
			responseGrowth: stats.totalResponses > 0 ? ('up' as const) : ('down' as const),
			visitorGrowth: stats.totalCompletions > 0 ? ('up' as const) : ('down' as const),
		},
		topTests: topTestsQuery.data || [],
		loading: statsQuery.isLoading || topTestsQuery.isLoading,
		error: statsQuery.error?.message || topTestsQuery.error?.message || null,
		lastUpdated: new Date(),
	};
};
