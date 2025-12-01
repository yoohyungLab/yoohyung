// ============================================
// constants/test.ts
// 테스트 관련 모든 설정
// ============================================

export const TEST_TYPES = {
	psychology: {
		value: 'psychology',
		label: '심리 테스트',
		icon: '🧠',
	},
	balance: {
		value: 'balance',
		label: '밸런스 게임',
		icon: '⚖️',
	},
	quiz: {
		value: 'quiz',
		label: '퀴즈',
		icon: '❓',
	},
	personality: {
		value: 'personality',
		label: '성격 테스트',
		icon: '👤',
	},
} as const;

export const TEST_STATUSES = {
	draft: {
		value: 'draft',
		label: '초안',
		color: 'gray',
	},
	published: {
		value: 'published',
		label: '게시됨',
		color: 'green',
	},
	scheduled: {
		value: 'scheduled',
		label: '예약됨',
		color: 'blue',
	},
	archived: {
		value: 'archived',
		label: '보관됨',
		color: 'red',
	},
} as const;

export const TEST_SECTIONS = {
	popular: { badge: 'HOT', variant: 'hot' as const },
	new: { badge: 'NEW', variant: 'new' as const },
	recommended: { badge: 'PICK', variant: 'recommended' as const },
	trending: { badge: 'TOP', variant: 'trending' as const },
} as const;

// 타입 - 실제 DB에 저장되는 값
export type TestType = keyof typeof TEST_TYPES;
export type TestStatus = keyof typeof TEST_STATUSES;
export type TestSection = keyof typeof TEST_SECTIONS;
