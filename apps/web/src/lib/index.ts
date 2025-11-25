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
export {
	formatDate,
	formatDateTime,
	parseDescription,
	parseStringOrArray,
	parseGifts,
	parseCompatibility,
	parseJobs,
} from './format-utils';

// ============ Error Handling ============
export { mapAuthError, mapApiError } from '@pickid/shared';
export { handleSupabaseError, isNotFoundError } from './supabase-error-handler';

// ============ Test Utils ============
export { isMobileDevice, getHomeButtonText, getTestTypeName } from './test-utils';

// ============ Type Guards ============
export {
	isString,
	isNumber,
	isArray,
	isStringArray,
	isObject,
	asString,
	asNumber,
	asStringArray,
	asObject,
} from './type-guards';

// ============ Common Utils ============
export { cn } from './utils';
