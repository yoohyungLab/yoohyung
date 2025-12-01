export const ROUTES = {
	HOME: '/',

	TESTS: '/tests',
	TEST_DETAIL: '/tests/:id',
	TEST_RESULT: '/tests/:id/result',
	TEST_POPULAR: '/popular',
	TESTS_CATEGORY: '/category',

	FEEDBACK: '/feedback',
	FEEDBACK_DETAIL: '/feedback/:id',
	FEEDBACK_CREATE: '/feedback/create',

	AUTH: '/auth',
	AUTH_LOGIN: '/auth/login',
	AUTH_REGISTER: '/auth/register',

	// 동적 경로는 함수로
	testDetail: (id: string) => `/tests/${id}`,
	testResult: (id: string) => `/tests/${id}/result`,
	feedbackDetail: (id: string) => `/feedback/${id}`,
} as const;
