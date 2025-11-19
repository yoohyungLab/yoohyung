/**
 * Shared Lib - Public API
 *
 * FSD 구조: 기능별로 그룹화된 유틸리티 함수들
 */

// ============ Analytics ============
export { trackResultViewed, trackResultShared, trackTestStart } from './analytics';

// ============ Balance Game ============
export { calculateProgress } from './balance-game';

// ============ Color Utils ============
export {
	hexToRgba,
	adjustColor,
	getBackgroundGradient,
	getThemedColors,
	createCardStyles,
	createDecorationStyle,
} from './color-utils';

// ============ Format Utils ============
export { formatDate, formatDateTime, parseDescription } from './format-utils';

// ============ Error Handling ============
export { mapAuthError } from './error-mapper';

// ============ Query Client ============
export { queryClient } from './query-client';

// ============ Test Utils ============
export { isMobileDevice } from './test-utils';
export { mapTestWithDetailsToNested } from './test-mappers';

// ============ Common Utils ============
export { cn } from './utils';
