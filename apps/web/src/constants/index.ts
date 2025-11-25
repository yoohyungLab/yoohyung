/**
 * Shared Constants - Public API
 *
 * 모든 상수를 중앙에서 관리하고 재내보냅니다.
 */

// Routes
export * from './routes';

// Test
export * from './test';

// Quiz
export * from './quiz';

// UI
export * from './ui';

// Feedback
export * from './feedback';

// Common
export * from './common';

// Legacy exports (하위 호환성 - 점진적 제거 예정)
// @deprecated - FEEDBACK_CATEGORY_LABEL을 사용하세요
export { FEEDBACK_CATEGORY_LABEL as FEEDBACK_CATEGORIES } from './feedback';

// @deprecated - FEEDBACK_STATUS_LABEL을 사용하세요
export { FEEDBACK_STATUS_LABEL as FEEDBACK_STATUS } from './feedback';
