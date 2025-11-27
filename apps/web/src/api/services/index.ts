/**
 * Services - Public API
 *
 * 모든 서비스를 중앙에서 관리하고 재내보냅니다.
 */

// Service exports
export { authService } from './auth.service';
export { categoryService } from './category.service';
export { feedbackService } from './feedback.service';
export { homeService } from './home.service';
export { homeBalanceGameService } from './home-balance-game.service';
export { optimizedBalanceGameStatsService } from './optimized-balance-game-stats.service';
export { popularService } from './popular.service';

// Test-related services (분해됨)
export { testService } from './test.service';
export { testResponseService } from './test-response.service';
export { testResultService } from './test-result.service';

// Type re-exports from auth.service
export type { Session, User } from './auth.service';

// Type re-exports from category.service
export type { Category, CategoryWithTestCount, CategoryPageData, AllCategoriesData } from './category.service';

// Type re-exports from feedback.service
export type { Feedback, ISubmitFeedbackParams } from './feedback.service';

// Type re-exports from home.service
// (Category와 Test는 이미 다른 서비스에서 export됨)

// Type re-exports from home-balance-game.service
export type { HomeBalanceGameResponse, VoteResult } from './home-balance-game.service';

// Type re-exports from test services
export type { Test, TestWithNestedDetails } from './test.service';
export type { UserTestResponse, TestCompletionResult } from './test-response.service';
export type { TestResult, TestResultInsert, ITestResultRow } from './test-result.service';
