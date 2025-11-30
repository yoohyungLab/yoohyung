export const testKeys = {
	all: ['tests'] as const,
	lists: () => [...testKeys.all, 'list'] as const,
	list: (filters: string) => [...testKeys.all, 'list', { filters }] as const,
	details: () => [...testKeys.all, 'detail'] as const,
	detail: (id: string) => [...testKeys.all, 'detail', id] as const,
} as const;

export const categoryKeys = {
	all: ['categories'] as const,
	lists: () => [...categoryKeys.all, 'list'] as const,
	list: (filters: string) => [...categoryKeys.all, 'list', { filters }] as const,
	details: () => [...categoryKeys.all, 'detail'] as const,
	detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
	active: () => [...categoryKeys.all, 'active'] as const,
} as const;

export const feedbackKeys = {
	all: ['feedbacks'] as const,
	lists: () => [...feedbackKeys.all, 'list'] as const,
	list: (filters: string) => [...feedbackKeys.all, 'list', { filters }] as const,
	details: () => [...feedbackKeys.all, 'detail'] as const,
	detail: (id: string) => [...feedbackKeys.all, 'detail', id] as const,
	stats: () => [...feedbackKeys.all, 'stats'] as const,
} as const;

export const userKeys = {
	all: ['users'] as const,
	lists: () => [...userKeys.all, 'list'] as const,
	list: (filters: string) => [...userKeys.all, 'list', { filters }] as const,
	details: () => [...userKeys.all, 'detail'] as const,
	detail: (id: string) => [...userKeys.all, 'detail', id] as const,
	stats: () => [...userKeys.all, 'stats'] as const,
	responses: (userId: string) => [...userKeys.all, 'responses', userId] as const,
} as const;

export const analyticsKeys = {
	all: ['analytics'] as const,
	dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
	testStats: (testId: string) => [...analyticsKeys.all, 'test-stats', testId] as const,
	topTests: (limit: number) => [...analyticsKeys.all, 'top-tests', limit] as const,
} as const;

export const authKeys = {
	all: ['auth'] as const,
	user: () => [...authKeys.all, 'user'] as const,
	session: () => [...authKeys.all, 'session'] as const,
} as const;

export const homeBalanceGameKeys = {
	all: ['home-balance-game'] as const,
	current: () => [...homeBalanceGameKeys.all, 'current'] as const,
	userVote: (gameId: string) => [...homeBalanceGameKeys.all, 'user-vote', gameId] as const,
} as const;

export const balanceGameStatsKeys = {
	all: ['balance-game-stats'] as const,
	test: (testId: string) => [...balanceGameStatsKeys.all, testId] as const,
	question: (testId: string, questionId: string) => [...balanceGameStatsKeys.test(testId), questionId] as const,
} as const;

export const optimizedBalanceGameStatsKeys = {
	all: ['optimized-balance-game-stats'] as const,
	question: (questionId: string) => [...optimizedBalanceGameStatsKeys.all, 'question', questionId] as const,
	testQuestions: (testId: string) => [...optimizedBalanceGameStatsKeys.all, 'test', testId] as const,
} as const;

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
