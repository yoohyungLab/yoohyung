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
	{ value: 'in_progress', label: '진행중' },
	{ value: 'completed', label: '완료' },
	{ value: 'replied', label: '답변완료' },
	{ value: 'rejected', label: '반려' },
] as const;

export const FEEDBACK_CATEGORY_OPTIONS = [
	{ value: 'test_idea', label: '새 테스트 아이디어' },
	{ value: 'feature', label: '기능 개선 건의' },
	{ value: 'bug_report', label: '오류 신고' },
	{ value: 'design', label: '디자인 관련' },
	{ value: 'mobile', 'label': '모바일 이슈' },
	{ value: 'other', label: '기타 의견' },
] as const;

export const FEEDBACK_STATUS_LABELS = {
	pending: '검토중',
	in_progress: '진행중',
	completed: '완료',
	replied: '답변완료',
	rejected: '반려',
} as const;

export const FEEDBACK_CATEGORY_LABELS = {
	test_idea: '새 테스트 아이디어',
	feature: '기능 개선 건의',
	bug_report: '오류 신고',
	design: '디자인 관련',
	mobile: '모바일 이슈',
	other: '기타 의견',
} as const;

export const FEEDBACK_STATUS_COLORS = {
	pending: 'bg-amber-500 text-white',
	in_progress: 'bg-blue-500 text-white',
	completed: 'bg-emerald-500 text-white',
	replied: 'bg-violet-500 text-white',
	rejected: 'bg-rose-500 text-white',
} as const;

export const FILTER_FEEDBACK_STATUS_OPTIONS = [
	{ value: 'all', label: '전체 상태' },
	...FEEDBACK_STATUS_OPTIONS,
] as const;

export const FILTER_FEEDBACK_CATEGORY_OPTIONS = [
	{ value: 'all', label: '전체 카테고리' },
	...FEEDBACK_CATEGORY_OPTIONS,
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORY_OPTIONS)[number]['value'];

export const FEEDBACK_STATUS = {
	PENDING: 'pending',
	IN_PROGRESS: 'in_progress',
	COMPLETED: 'completed',
	REPLIED: 'replied',
	REJECTED: 'rejected',
} as const;