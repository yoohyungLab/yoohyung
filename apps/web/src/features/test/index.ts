// ============================================================================
// Test Feature - Public API
// ============================================================================

// UI Components
export { TestContainer } from './ui/test-container';
export { TestPageClient } from './ui/test-page-client';
export { TestIntro } from './ui/test-intro';
export { TestQuestion } from './ui/test-question';
export { TestResultContainer } from './ui/test-result-container';
export { TestResultContent } from './ui/test-result-content';
export { TestResultHeader } from './ui/test-result-header';
export { TestCTAButtons } from './ui/test-cta-buttons';
export { GenderSelectModal } from './ui/gender-select-modal';
export { SharedResultLanding } from './ui/shared-result-landing';

// Balance Game Components
export { BalanceGameContainer } from './ui/balance-game/balance-game-container';
export { BalanceGameQuestion } from './ui/balance-game/balance-game-question';
export { BalanceGameResultContainer } from './ui/balance-game/balance-game-result-container';
export { BalanceGameResultContent } from './ui/balance-game/balance-game-result-content';
export { BalanceGameResultHeader } from './ui/balance-game/balance-game-result-header';

// Balance Game Components (Sub-components)
export { FunStatsSection } from './ui/balance-game/components/fun-stats-section';
export { LoadingSkeleton } from './ui/balance-game/components/loading-skeleton';
export { PopularQuestionsSection } from './ui/balance-game/components/popular-questions-section';
export { PopularTestsSection } from './ui/balance-game/components/popular-tests-section';

// Test Sections
export { CompatibilitySection } from './ui/sections/compatibility-section';
export { DescriptionSection } from './ui/sections/description-section';
export { GiftsSection } from './ui/sections/gifts-section';
export { JobsSection } from './ui/sections/jobs-section';

// Hooks
export { useBalanceGameResult } from './hooks/useBalanceGameResult';
export { useTestResult } from './hooks/useTestResult';
export { useTestResultShare } from './hooks/useTestResultShare';

// Balance Game Hooks
export { useBalanceGameResultData } from './ui/balance-game/hooks/useBalanceGameResultData';

// Model/Hooks
export { useTestDetailVM } from './model/useTestDetailVM';
export { useTestListVM } from './model/useTestListVM';
export { useTestResultVM } from './model/useTestResultVM';
export { useTestStartVM } from './model/useTestStartVM';
export { useTestTakingVM } from './model/useTestTakingVM';

// Lib/Utils
export { colorThemes } from './lib/themes';
export type { ColorTheme } from './lib/themes';
