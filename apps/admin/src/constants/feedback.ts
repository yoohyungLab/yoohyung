// ============================================
// constants/feedback.ts
// 피드백 관련 설정
// ============================================

export const FEEDBACK_STATUSES = {
	pending: { value: 'pending', label: '대기중', variant: 'warning' as const },
	in_progress: { value: 'in_progress', label: '진행중', variant: 'info' as const },
	completed: { value: 'completed', label: '완료', variant: 'success' as const },
	replied: { value: 'replied', label: '답변완료', variant: 'secondary' as const },
	rejected: { value: 'rejected', label: '거부', variant: 'destructive' as const },
} as const;

export type FeedbackStatus = keyof typeof FEEDBACK_STATUSES;

export const FEEDBACK_CATEGORIES = {
	bug: { value: 'bug', label: '버그 신고', emoji: '🐛' },
	feature: { value: 'feature', label: '기능 제안', emoji: '💡' },
	improvement: { value: 'improvement', label: '개선 사항', emoji: '🔧' },
	ui: { value: 'ui', label: 'UI/UX', emoji: '🎨' },
	performance: { value: 'performance', label: '성능', emoji: '⚡' },
	other: { value: 'other', label: '기타', emoji: '💭' },
} as const;

export type FeedbackCategory = keyof typeof FEEDBACK_CATEGORIES;

// 레거시 호환성 (기존 코드에서 사용 중)
export const FEEDBACK_STATUS = {
	PENDING: 'pending',
	IN_PROGRESS: 'in_progress',
	COMPLETED: 'completed',
	REPLIED: 'replied',
	REJECTED: 'rejected',
} as const;

export const FEEDBACK_CATEGORY = {
	BUG: 'bug',
	FEATURE: 'feature',
	IMPROVEMENT: 'improvement',
	UI: 'ui',
	PERFORMANCE: 'performance',
	OTHER: 'other',
} as const;

// 레거시 호환성 (기존 코드에서 사용 중)
export const FEEDBACK_CATEGORY_OPTIONS = [
	{ value: 'bug', label: '버그 신고' },
	{ value: 'feature', label: '기능 제안' },
	{ value: 'improvement', label: '개선 사항' },
	{ value: 'ui', label: 'UI/UX' },
	{ value: 'performance', label: '성능' },
	{ value: 'other', label: '기타' },
] as const;
