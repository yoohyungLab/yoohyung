/**
 * Common Constants
 *
 * 전역적으로 사용되는 공통 상수를 정의합니다.
 */

// 기본 플레이스홀더 이미지
export const DEFAULT_PLACEHOLDER_IMAGE = '/images/placeholder.svg';

// 페이지네이션
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

// 로컬 스토리지 키
export const STORAGE_KEY = {
	AUTH_TOKEN: 'auth_token',
	USER_INFO: 'user_info',
	TEST_PROGRESS: 'test_progress',
} as const;

// 세션 스토리지 키
export const SESSION_KEY = {
	TEST_ANSWERS: 'test_answers',
	TEST_START_TIME: 'test_start_time',
} as const;

// 타임아웃 (ms)
export const TIMEOUT = {
	DEFAULT: 30000,
	LONG: 60000,
	SHORT: 10000,
} as const;

// 디바운스 딜레이 (ms)
export const DEBOUNCE_DELAY = {
	SEARCH: 300,
	INPUT: 500,
	RESIZE: 200,
} as const;
