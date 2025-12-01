export const FEEDBACK_CATEGORIES = {
	BUG: {
		VALUE: 'bug',
		LABEL: '버그 신고',
		EMOJI: '🐛',
		DESCRIPTION: '오류나 문제점을 신고해주세요',
	},
	FEATURE: {
		VALUE: 'feature',
		LABEL: '기능 제안',
		EMOJI: '💡',
		DESCRIPTION: '새로운 기능을 제안해주세요',
	},
	UI: {
		VALUE: 'ui',
		LABEL: 'UI/UX 개선',
		EMOJI: '🎨',
		DESCRIPTION: '디자인 개선사항을 알려주세요',
	},
	CONTENT: {
		VALUE: 'content',
		LABEL: '콘텐츠 관련',
		EMOJI: '📝',
		DESCRIPTION: '콘텐츠 관련 의견을 주세요',
	},
	OTHER: {
		VALUE: 'other',
		LABEL: '기타',
		EMOJI: '💭',
		DESCRIPTION: '기타 의견을 남겨주세요',
	},
} as const;

export type FeedbackCategory = keyof typeof FEEDBACK_CATEGORIES;

// ============================================
// 피드백 상태 설정 (모든 정보 포함)
// ============================================
export const FEEDBACK_STATUSES = {
	PENDING: {
		VALUE: 'pending',
		LABEL: '검토중',
		CLASS_NAME: 'bg-yellow-100 text-yellow-800',
	},
	IN_PROGRESS: {
		VALUE: 'in_progress',
		LABEL: '진행중',
		CLASS_NAME: 'bg-blue-100 text-blue-800',
	},
	COMPLETED: {
		VALUE: 'completed',
		LABEL: '완료',
		CLASS_NAME: 'bg-green-100 text-green-800',
	},
	REPLIED: {
		VALUE: 'replied',
		LABEL: '답변완료',
		CLASS_NAME: 'bg-green-100 text-green-800',
	},
	REJECTED: {
		VALUE: 'rejected',
		LABEL: '반려',
		CLASS_NAME: 'bg-red-100 text-red-800',
	},
} as const;

export type FeedbackStatus = keyof typeof FEEDBACK_STATUSES;
