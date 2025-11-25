/**
 * Feedback Constants
 *
 * 피드백 카테고리, 상태 등을 정의합니다.
 */

// 피드백 카테고리
export const FEEDBACK_CATEGORY = {
	BUG: 'bug',
	FEATURE: 'feature',
	UI: 'ui',
	CONTENT: 'content',
	OTHER: 'other',
} as const;

export type TFeedbackCategory = (typeof FEEDBACK_CATEGORY)[keyof typeof FEEDBACK_CATEGORY];

// 피드백 카테고리 레이블
export const FEEDBACK_CATEGORY_LABEL = {
	bug: '버그 신고',
	feature: '기능 제안',
	ui: 'UI/UX 개선',
	content: '콘텐츠 관련',
	other: '기타',
} as const;

// 피드백 상태
export const FEEDBACK_STATUS = {
	PENDING: 'pending',
	IN_PROGRESS: 'in_progress',
	COMPLETED: 'completed',
	REPLIED: 'replied',
	REJECTED: 'rejected',
} as const;

export type TFeedbackStatus = (typeof FEEDBACK_STATUS)[keyof typeof FEEDBACK_STATUS];

// 피드백 상태 레이블
export const FEEDBACK_STATUS_LABEL = {
	pending: '검토중',
	in_progress: '진행중',
	completed: '완료',
	replied: '답변완료',
	rejected: '반려',
} as const;

// 피드백 상태 색상
export const FEEDBACK_STATUS_COLOR = {
	pending: 'bg-yellow-500 text-white',
	in_progress: 'bg-blue-500 text-white',
	completed: 'bg-green-500 text-white',
	replied: 'bg-emerald-500 text-white',
	rejected: 'bg-gray-500 text-white',
} as const;
