/**
 * Query Key Factory
 *
 * TanStack Query의 모든 쿼리 키를 중앙 관리합니다.
 * 계층적 구조로 키를 관리하여 무효화(invalidation) 및 캐싱을 효율적으로 수행합니다.
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

// Tests
export const testKeys = {
	all: ['tests'] as const,
	lists: () => [...testKeys.all, 'list'] as const,
	list: (filters: string) => [...testKeys.all, 'list', { filters }] as const,
	details: () => [...testKeys.all, 'detail'] as const,
	detail: (id: string) => [...testKeys.all, 'detail', id] as const,
} as const;

// Categories
export const categoryKeys = {
	all: ['categories'] as const,
	lists: () => [...categoryKeys.all, 'list'] as const,
	list: (filters: string) => [...categoryKeys.all, 'list', { filters }] as const,
	details: () => [...categoryKeys.all, 'detail'] as const,
	detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
	active: () => [...categoryKeys.all, 'active'] as const,
} as const;

// Feedbacks
export const feedbackKeys = {
	all: ['feedbacks'] as const,
	lists: () => [...feedbackKeys.all, 'list'] as const,
	list: (filters: string) => [...feedbackKeys.all, 'list', { filters }] as const,
	details: () => [...feedbackKeys.all, 'detail'] as const,
	detail: (id: string) => [...feedbackKeys.all, 'detail', id] as const,
	stats: () => [...feedbackKeys.all, 'stats'] as const,
} as const;

// Users
export const userKeys = {
	all: ['users'] as const,
	lists: () => [...userKeys.all, 'list'] as const,
	list: (filters: string) => [...userKeys.all, 'list', { filters }] as const,
	details: () => [...userKeys.all, 'detail'] as const,
	detail: (id: string) => [...userKeys.all, 'detail', id] as const,
	stats: () => [...userKeys.all, 'stats'] as const,
	responses: (userId: string) => [...userKeys.all, 'responses', userId] as const,
} as const;

// Analytics
export const analyticsKeys = {
	all: ['analytics'] as const,
	dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
	testStats: (testId: string) => [...analyticsKeys.all, 'test-stats', testId] as const,
	topTests: (limit: number) => [...analyticsKeys.all, 'top-tests', limit] as const,
} as const;

// Auth
export const authKeys = {
	all: ['auth'] as const,
	user: () => [...authKeys.all, 'user'] as const,
	session: () => [...authKeys.all, 'session'] as const,
} as const;

// Home Balance Game
export const homeBalanceGameKeys = {
	all: ['home-balance-game'] as const,
	current: () => [...homeBalanceGameKeys.all, 'current'] as const,
	userVote: (gameId: string) => [...homeBalanceGameKeys.all, 'user-vote', gameId] as const,
} as const;

// Balance Game Stats
export const balanceGameStatsKeys = {
	all: ['balance-game-stats'] as const,
	test: (testId: string) => [...balanceGameStatsKeys.all, testId] as const,
	question: (testId: string, questionId: string) => [...balanceGameStatsKeys.test(testId), questionId] as const,
} as const;

// Optimized Balance Game Stats
export const optimizedBalanceGameStatsKeys = {
	all: ['optimized-balance-game-stats'] as const,
	question: (questionId: string) => [...optimizedBalanceGameStatsKeys.all, 'question', questionId] as const,
	testQuestions: (testId: string) => [...optimizedBalanceGameStatsKeys.all, 'test', testId] as const,
} as const;

// 전체 Query Keys 내보내기
export const queryKeys = {
	tests: testKeys,
	categories: categoryKeys,
	feedbacks: feedbackKeys,
	users: userKeys,
	analytics: analyticsKeys,
	auth: authKeys,
	homeBalanceGame: homeBalanceGameKeys,
	balanceGameStats: balanceGameStatsKeys,
	optimizedBalanceGameStats: optimizedBalanceGameStatsKeys,
} as const;
