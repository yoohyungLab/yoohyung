/**
 * Routes Constants
 *
 * 애플리케이션의 모든 경로를 중앙에서 관리합니다.
 * 타입 안전한 네비게이션을 위해 HREF 함수를 제공합니다.
 */

export const PATH = {
	INDEX: '/',

	// 테스트
	TESTS: '/tests',
	TEST_DETAIL: '/tests/:id',
	TEST_RESULT: '/tests/:id/result',

	// 카테고리 & 인기
	POPULAR: '/popular',
	CATEGORY: '/category',

	// 인증
	AUTH: '/auth',
	AUTH_LOGIN: '/auth/login',
	AUTH_REGISTER: '/auth/register',

	// 피드백
	FEEDBACK: '/feedback',
	FEEDBACK_CREATE: '/feedback/create',
	FEEDBACK_DETAIL: '/feedback/:id',

	// 마이페이지
	MYPAGE: '/mypage',
} as const;

/**
 * 동적 경로 생성 함수
 */
export const HREF = {
	TEST_DETAIL: (testId: string | number) => `/tests/${testId}`,
	TEST_RESULT: (testId: string | number) => `/tests/${testId}/result`,
	FEEDBACK_DETAIL: (feedbackId: string | number) => `/feedback/${feedbackId}`,
} as const;
