// Custom Hooks
export { useAdminAuth } from './useAdminAuth';
export { useAnalytics } from './useAnalytics';
export { useMarketingAnalytics } from './useMarketingAnalytics';
export { useCategories } from './useCategories';
export { useDashboard } from './useDashboard';
export { useFeedbacks } from './useFeedbacks';
export { useTestCreation } from './useTestCreation';
export { useTests } from './useTests';
export { useUserResponses } from './useUserResponses';
// useUsers는 useUsersQuery.ts에서 export됨

// React Query 기반 훅들 (최적화된 버전)
// TODO: 왜 있어야 하는건지?
export {
	useAnalyticsTests,
	useDashboardStats,
	useTestDetailedStats,
	useTestBasicStats,
	useTestAnalyticsData,
	useTestTrendsData,
	useTestSegmentsData,
	useTestFunnelData,
	useTestQualityMetrics,
	useCategoryStats,
	useResponsesChartData,
	useUserResponseStats,
	useInvalidateAnalyticsCache,
} from './useAnalyticsQuery';

export {
	useUsers,
	useUsersQuery,
	useUser,
	useUserStats,
	useCreateUser,
	useUpdateUser,
	useUpdateUserStatus,
	useBulkUpdateUserStatus,
	useDeleteUser,
} from './useUsersQuery';
