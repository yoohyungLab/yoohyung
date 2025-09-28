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
	// 테스트 관련
	tests: {
		all: ['tests'] as const,
		lists: () => [...queryKeys.tests.all, 'list'] as const,
		list: (filters: Record<string, unknown>) => [...queryKeys.tests.lists(), { filters }] as const,
		details: () => [...queryKeys.tests.all, 'detail'] as const,
		detail: (id: string) => [...queryKeys.tests.details(), id] as const,
		published: () => [...queryKeys.tests.all, 'published'] as const,
	},

	// 사용자 관련
	users: {
		all: ['users'] as const,
		profile: () => [...queryKeys.users.all, 'profile'] as const,
	},

	// 인증 관련
	auth: {
		all: ['auth'] as const,
		user: () => [...queryKeys.auth.all, 'user'] as const,
	},
} as const;
