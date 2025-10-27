import { QueryClient } from '@tanstack/react-query';

// React Query 클라이언트 설정
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// 기본 캐시 시간: 5분
			staleTime: 5 * 60 * 1000,
			// 캐시 유지 시간: 10분
			gcTime: 10 * 60 * 1000,
			// 재시도 횟수
			retry: 2,
			// 백그라운드에서 자동 리페치 비활성화 (수동 제어)
			refetchOnWindowFocus: false,
			// 네트워크 재연결 시 자동 리페치
			refetchOnReconnect: true,
			// 에러 발생 시 재시도 간격
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
		mutations: {
			// 뮤테이션 재시도 횟수
			retry: 1,
		},
	},
});

// 쿼리 키 팩토리 - 타입 안전성을 위한 쿼리 키 생성
export const queryKeys = {
	// 사용자 관련
	users: {
		all: ['users'] as const,
		lists: () => [...queryKeys.users.all, 'list'] as const,
		list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), { filters }] as const,
		details: () => [...queryKeys.users.all, 'detail'] as const,
		detail: (id: string) => [...queryKeys.users.details(), id] as const,
		stats: () => [...queryKeys.users.all, 'stats'] as const,
	},

	// 테스트 관련
	tests: {
		all: ['tests'] as const,
		lists: () => [...queryKeys.tests.all, 'list'] as const,
		list: (filters: Record<string, unknown>) => [...queryKeys.tests.lists(), { filters }] as const,
		details: () => [...queryKeys.tests.all, 'detail'] as const,
		detail: (id: string) => [...queryKeys.tests.details(), id] as const,
		analytics: (id: string) => [...queryKeys.tests.detail(id), 'analytics'] as const,
	},

	// 분석 관련
	analytics: {
		all: ['analytics'] as const,
		dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
		topTests: (limit: number) => [...queryKeys.analytics.all, 'top-tests', limit] as const,
		testStats: (testId: string) => [...queryKeys.analytics.all, 'test-stats', testId] as const,
		testAnalytics: (testId: string) => [...queryKeys.analytics.all, 'test-analytics', testId] as const,
		testTrends: (testId: string, daysBack: number) =>
			[...queryKeys.analytics.all, 'test-trends', testId, daysBack] as const,
		testSegments: (testId: string) => [...queryKeys.analytics.all, 'test-segments', testId] as const,
		testFunnel: (testId: string) => [...queryKeys.analytics.all, 'test-funnel', testId] as const,
		testQuality: (testId: string) => [...queryKeys.analytics.all, 'test-quality', testId] as const,
		categoryStats: () => [...queryKeys.analytics.all, 'category-stats'] as const,
	},

	// 피드백 관련
	feedbacks: {
		all: ['feedbacks'] as const,
		lists: () => [...queryKeys.feedbacks.all, 'list'] as const,
		list: (filters: Record<string, unknown>) => [...queryKeys.feedbacks.lists(), { filters }] as const,
	},

	// 카테고리 관련
	categories: {
		all: ['categories'] as const,
		lists: () => [...queryKeys.categories.all, 'list'] as const,
	},

	// 사용자 응답 관련
	responses: {
		all: ['responses'] as const,
		lists: () => [...queryKeys.responses.all, 'list'] as const,
		list: (filters: Record<string, unknown>) => [...queryKeys.responses.lists(), { filters }] as const,
		stats: () => [...queryKeys.responses.all, 'stats'] as const,
		detail: (id: string) => [...queryKeys.responses.all, 'detail', id] as const,
	},
} as const;
