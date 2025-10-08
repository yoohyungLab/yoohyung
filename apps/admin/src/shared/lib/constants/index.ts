// 기존 상수들
export const PROFILE_STATUS = {
	ACTIVE: 'active',
	INACTIVE: 'inactive',
	DELETED: 'deleted',
} as const;

export const PROFILE_PROVIDER = {
	EMAIL: 'email',
	GOOGLE: 'google',
	KAKAO: 'kakao',
} as const;

export const PROFILE_PROVIDER_LABELS = {
	email: '이메일',
	google: '구글',
	kakao: '카카오',
} as const;

export const PAGINATION = {
	DEFAULT_PAGE_SIZE: 20,
	DEBOUNCE_DELAY: 300,
} as const;

export const FEEDBACK_CATEGORIES = [
	{
		name: 'bug',
		label: '버그 신고',
		description: '오류나 문제점을 발견했어요',
		emoji: '🐛',
	},
	{
		name: 'feature',
		label: '기능 제안',
		description: '새로운 기능을 제안해요',
		emoji: '💡',
	},
	{
		name: 'improvement',
		label: '개선 사항',
		description: '기존 기능을 개선하고 싶어요',
		emoji: '⚡',
	},
	{
		name: 'ui',
		label: 'UI/UX',
		description: '디자인이나 사용성을 개선하고 싶어요',
		emoji: '🎨',
	},
	{
		name: 'performance',
		label: '성능',
		description: '속도나 최적화 관련 피드백이에요',
		emoji: '🚀',
	},
	{
		name: 'other',
		label: '기타',
		description: '다른 의견이나 제안이에요',
		emoji: '💬',
	},
] as const;

// 모든 옵션 상수들 re-export
export * from './options';
// 필터 관련 상수들 re-export
export * from './filters';
