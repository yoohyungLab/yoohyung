/**
 * Shared Constants - Public API
 *
 * FSD 구조: 애플리케이션 전역 상수 정의
 */

// 피드백 관련 상수

export const FEEDBACK_CATEGORIES = {
	bug: '버그 신고',
	feature: '기능 제안',
	ui: 'UI/UX 개선',
	content: '콘텐츠 관련',
	other: '기타',
} as const;

export const FEEDBACK_STATUS = {
	pending: '검토중',
	in_progress: '진행중',
	completed: '완료',
	replied: '답변완료',
	rejected: '반려',
} as const;
