export const PATH = {
	INDEX: '/',
	AUTH: '/auth',

	TESTS: '/tests',
	TEST_CREATE: '/tests/create',
	TEST_EDIT: '/tests/:testId/edit',

	CATEGORIES: '/categories',

	USERS: '/users',
	RESPONSES: '/responses',

	FEEDBACKS: '/feedbacks',

	ANALYTICS: '/analytics',
	ANALYTICS_TEST_DETAIL: '/analytics/tests/:testId',

	GROWTH: '/growth',
	GROWTH_FUNNEL: '/growth/funnel',
	GROWTH_CHANNELS: '/growth/channels',
	GROWTH_LANDINGS: '/growth/landings',
	GROWTH_COHORTS: '/growth/cohorts',
} as const;

export const HREF = {
	TEST_EDIT: (testId: string | number) => `/tests/${testId}/edit`,
	TEST_DETAIL: (testId: string | number) => `/tests/${testId}`,
	ANALYTICS_TEST_DETAIL: (testId: string | number) => `/analytics/tests/${testId}`,
} as const;
