// Analytics
export { trackResultViewed, trackResultShared, trackTestStart } from './analytics';

// Balance Game Utils
export {
	calculateBalanceGameStats,
	createBalanceGameOptions,
	getVoteCountText,
	calculateSinglePercentage,
	calculateABPercentages,
	calculatePercentages,
	normalizeAccumulatedStats,
	calculateABStats,
	calculateComparisonStats,
	findMostPopularChoice,
	findChoiceStat,
	findControversialChoice,
	findOverwhelmingChoice,
} from './balance-game.utils';

// Balance Game Constants (re-export)
export { BALANCE_GAME_DEFAULTS, BALANCE_GAME_TEXT } from '@/constants/balance-game';

// Color Utils
export {
	adjustColor,
	getBackgroundGradient,
	getThemedColors,
	createCardStyles,
	createDecorationStyle,
} from './color-utils';

// Format Utils
export { formatDate, formatDateTime, parseDescription, parseStringOrArray } from './format-utils';

// Image Preload
export { preloadImage } from './image-preload';

// Shared Utils (re-export)
export { mapAuthError, mapApiError, isNotFoundError, cn } from '@pickid/shared';

// Transforms
export { getCategoryNames, transformToTestCard, transformTestsToCards } from './transforms';

// Test Result Matching
export { findMatchingResult, findResultByScore, findResultByCode } from './test-result-matching';

