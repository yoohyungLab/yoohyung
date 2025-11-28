// 테스트 타입 값
export const TEST_TYPE = {
	PSYCHOLOGY: 'psychology',
	BALANCE: 'balance',
	QUIZ: 'quiz',
	PERSONALITY: 'personality',
} as const;

export type TTestType = (typeof TEST_TYPE)[keyof typeof TEST_TYPE];

// 테스트 상태
export const TEST_STATUS = {
	DRAFT: 'draft',
	PUBLISHED: 'published',
	SCHEDULED: 'scheduled',
	ARCHIVED: 'archived',
} as const;

export type TTestStatus = (typeof TEST_STATUS)[keyof typeof TEST_STATUS];

// 테스트 상태 레이블
export const TEST_STATUS_LABEL = {
	draft: '초안',
	published: '게시됨',
	scheduled: '예약됨',
	archived: '보관됨',
} as const;

// 테스트 타입 레이블
export const TEST_TYPE_LABEL = {
	psychology: '심리 테스트',
	balance: '밸런스 게임',
	quiz: '퀴즈',
	personality: '성격 테스트',
} as const;
