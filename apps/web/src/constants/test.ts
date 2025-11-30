// 테스트 타입 값
export const TEST_TYPE = {
	PSYCHOLOGY: 'psychology',
	BALANCE: 'balance',
	QUIZ: 'quiz',
	PERSONALITY: 'personality',
} as const;

// TODO: 왜 분리해서 써야하는지? 실제로 사용하고 잇는게맞는지? TTestType을 여기저기서 만히 쓰는데 하나로만 쓰게 해주고 굳이 타입화해야하는지도 확인해보기. 필요없으면 제거
export type TTestType = (typeof TEST_TYPE)[keyof typeof TEST_TYPE];

// 테스트 상태
export const TEST_STATUS = {
	DRAFT: 'draft',
	PUBLISHED: 'published',
	SCHEDULED: 'scheduled',
	ARCHIVED: 'archived',
} as const;

// TODO: 왜 분리해서 써야하는지? 실제로 사용하고 잇는게맞는지? TTestStatus 여기저기서 만히 쓰는데 하나로만 쓰게 해주고 굳이 타입화해야하는지도 확인해보기. 필요없으면 제거
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
