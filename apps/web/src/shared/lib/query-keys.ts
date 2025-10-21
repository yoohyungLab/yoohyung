/**
 * Query Key Factory
 *
 * TanStack Query의 모든 쿼리 키를 중앙 관리합니다.
 * 계층적 구조로 키를 관리하여 무효화(invalidation) 및 캐싱을 효율적으로 수행합니다.
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

// ============================================================================
// 홈 밸런스 게임
// ============================================================================

export const homeBalanceGameKeys = {
	all: ['home-balance-game'] as const,
	current: () => [...homeBalanceGameKeys.all, 'current'] as const,
	userVote: (gameId: string) => [...homeBalanceGameKeys.all, 'user-vote', gameId] as const,
} as const;

// ============================================================================
// 밸런스 게임 통계
// ============================================================================

export const balanceGameStatsKeys = {
	all: ['balance-game-stats'] as const,
	test: (testId: string) => [...balanceGameStatsKeys.all, testId] as const,
	question: (testId: string, questionId: string) => [...balanceGameStatsKeys.test(testId), questionId] as const,
} as const;

// ============================================================================
// 최적화된 밸런스 게임 통계
// ============================================================================

export const optimizedBalanceGameStatsKeys = {
	all: ['optimized-balance-game-stats'] as const,
	question: (questionId: string) => [...optimizedBalanceGameStatsKeys.all, 'question', questionId] as const,
	testQuestions: (testId: string) => [...optimizedBalanceGameStatsKeys.all, 'test', testId] as const,
} as const;

// ============================================================================
// 전체 Query Keys 내보내기
// ============================================================================

export const queryKeys = {
	homeBalanceGame: homeBalanceGameKeys,
	balanceGameStats: balanceGameStatsKeys,
	optimizedBalanceGameStats: optimizedBalanceGameStatsKeys,
} as const;
