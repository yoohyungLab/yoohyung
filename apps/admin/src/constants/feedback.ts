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

export const FEEDBACK_STATUS_OPTIONS = [
	{ value: 'pending', label: '검토중' },
	{ value: 'in_progress', label: '진행중' },	{ value: 'completed', label: '완료' },
	{ value: 'replied', label: '답변완료' },
	{ value: 'rejected', label: '반려' },
] as const;

export const FEEDBACK_CATEGORY_OPTIONS = FEEDBACK_CATEGORIES.map((cat) => ({
	value: cat.name,
	label: cat.label,
})) as const;

export const FILTER_FEEDBACK_STATUS_OPTIONS = [
	{ value: 'all', label: '전체 상태' },
	...FEEDBACK_STATUS_OPTIONS,
] as const;

export const FILTER_FEEDBACK_CATEGORY_OPTIONS = [
	{ value: 'all', label: '전체 카테고리' },
	...FEEDBACK_CATEGORY_OPTIONS,
] as const;



export const FEEDBACK_STATUS = {
	PENDING: 'pending',
	IN_PROGRESS: 'in_progress',
	COMPLETED: 'completed',
	REPLIED: 'replied',
	REJECTED: 'rejected',
} as const;