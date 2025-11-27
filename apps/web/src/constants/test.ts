// Test Constants
//
// 테스트 관련 상수를 정의합니다.

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

// 테스트 타입 설명
export const TEST_TYPE_CONFIG = {
	psychology: {
		name: '심리 테스트',
		description: '당신의 성향과 심리를 분석합니다',
		icon: '🧠',
	},
	balance: {
		name: '밸런스 게임',
		description: '두 가지 선택지 중 하나를 고르세요',
		icon: '⚖️',
	},
	quiz: {
		name: '퀴즈',
		description: '지식을 테스트하는 퀴즈입니다',
		icon: '❓',
	},
	personality: {
		name: '성격 테스트',
		description: '당신의 성격을 분석합니다',
		icon: '✨',
	},
} as const;
