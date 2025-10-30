// ============================================================================
// Test Feature - Public API
// ============================================================================

// UI Components - Psychology
export { TestContainer } from './ui/psychology/test-container';
export { TestIntro } from './ui/psychology/test-intro';
export { TestQuestion } from './ui/psychology/test-question';
export { TestResultContainer } from './ui/psychology/test-result-container';
export { TestResultContent } from './ui/psychology/test-result-content';
export { TestResultHeader } from './ui/psychology/test-result-header';
export { GenderSelectModal } from './ui/psychology/gender-select-modal';
export { SharedResultLanding } from './ui/psychology/shared-result-landing';

// UI Components - Balance Game
export { BalanceGameContainer } from './ui/balance-game/balance-game-container';
export { BalanceGameQuestion } from './ui/balance-game/balance-game-question';
export { BalanceGameResultContainer } from './ui/balance-game/balance-game-result-container';
export { BalanceGameResultContent } from './ui/balance-game/balance-game-result-content';
export { BalanceGameResultHeader } from './ui/balance-game/balance-game-result-header';

// UI Components - Shared
export { TestCTAButtons } from './ui/shared/test-cta-buttons';

// Sections - Balance Game
export { FunStatsSection } from './ui/balance-game/sections/fun-stats-section';
export { LoadingSkeleton } from './ui/balance-game/sections/loading-skeleton';
export { PopularQuestionsSection } from './ui/balance-game/sections/popular-questions-section';
export { PopularTestsSection } from './ui/balance-game/sections/popular-tests-section';

// Sections - Psychology
export { CompatibilitySection } from './ui/psychology/sections/compatibility-section';
export { DescriptionSection } from './ui/psychology/sections/description-section';
export { GiftsSection } from './ui/psychology/sections/gifts-section';
export { JobsSection } from './ui/psychology/sections/jobs-section';

// Hooks
export { useBalanceGameResult } from './hooks/use-balance-game-result';
export { useTestResult } from './hooks/use-test-result';
export { useTestResultShare } from './hooks/use-test-result-share';
export { useAnswerSubmit } from './hooks/use-answer-submit';
export { useTestProgress } from './hooks/use-test-progress';

// Model/Hooks
export { useTestDetail } from './model/use-test-detail';
export { useTestList } from './model/use-test-list';
export { useTestStart } from './model/use-test-start';
export { useTestTaking } from './model/use-test-taking';

// Lib/Utils
export { colorThemes } from './lib/themes';
export type { ColorTheme } from './lib/themes';
