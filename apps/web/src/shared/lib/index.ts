// ============================================================================
// Shared Lib - Public API
// ============================================================================

export { trackResultViewed, trackResultShared, trackTestStart } from './analytics';
export { calculateProgress, findChoiceStat, generateThemeFromTestId } from './balance-game';
export { hexToRgba, adjustColor, getBackgroundGradient } from './color-utils';
export { mapAuthError } from './error-mapper';
export { queryClient } from './query-client';
export { getHomeButtonText, getTestTypeName, isMobileDevice } from './test-utils';
export { cn } from './utils';
