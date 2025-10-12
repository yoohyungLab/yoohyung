// 모든 옵션 상수들을 통합 관리

// ===== 공통 옵션 =====
export const ALL_OPTION = { value: 'all', label: '전체' } as const;

// ===== 사용자 관련 =====
export const USER_STATUS_OPTIONS = [
	{ value: 'active', label: '활성' },
	{ value: 'inactive', label: '비활성' },
	{ value: 'deleted', label: '탈퇴' },
] as const;

export const USER_PROVIDER_OPTIONS = [
	{ value: 'email', label: '이메일' },
	{ value: 'kakao', label: '카카오' },
] as const;

// 사용자 라벨과 색상
export const USER_STATUS_LABELS = {
	active: '활성',
	inactive: '비활성',
	deleted: '탈퇴',
} as const;

export const USER_PROVIDER_LABELS = {
	email: '이메일',
	kakao: '카카오',
} as const;

export const USER_STATUS_COLORS = {
	active: 'bg-emerald-500 text-white',
	inactive: 'bg-amber-500 text-white',
	deleted: 'bg-rose-500 text-white',
} as const;

// 사용자 필터용 (전체 옵션 포함)
export const FILTER_USER_STATUS_OPTIONS = [{ value: 'all', label: '전체 상태' }, ...USER_STATUS_OPTIONS] as const;

export const FILTER_USER_PROVIDER_OPTIONS = [
	{ value: 'all', label: '전체 가입경로' },
	...USER_PROVIDER_OPTIONS,
] as const;

// ===== 카테고리 관련 =====
export const CATEGORY_STATUS_OPTIONS = [
	{ value: 'active', label: '활성' },
	{ value: 'inactive', label: '비활성' },
] as const;

// 카테고리 라벨과 색상
export const CATEGORY_STATUS_LABELS = {
	active: '활성',
	inactive: '비활성',
} as const;

export const CATEGORY_STATUS_COLORS = {
	active: 'bg-emerald-500 text-white',
	inactive: 'bg-amber-500 text-white',
} as const;

// 카테고리 필터용 (전체 옵션 포함)
export const FILTER_CATEGORY_STATUS_OPTIONS = [
	{ value: 'all', label: '전체 상태' },
	...CATEGORY_STATUS_OPTIONS,
] as const;

// ===== 테스트 관련 =====
export const TEST_STATUS_OPTIONS = [
	{ value: 'draft', label: '초안' },
	{ value: 'published', label: '게시됨' },
	{ value: 'scheduled', label: '예약됨' },
	{ value: 'archived', label: '보관됨' },
] as const;

// 테스트 라벨과 색상
export const TEST_STATUS_LABELS = {
	draft: '초안',
	published: '게시됨',
	scheduled: '예약됨',
	archived: '보관됨',
} as const;

export const TEST_STATUS_COLORS = {
	draft: 'bg-amber-500 text-white',
	published: 'bg-emerald-500 text-white',
	scheduled: 'bg-blue-500 text-white',
	archived: 'bg-gray-500 text-white',
} as const;

// 테스트 필터용 (전체 옵션 포함)
export const FILTER_TEST_STATUS_OPTIONS = [
	{ value: 'all', label: '전체 상태' },
	{ value: 'draft', label: '초안' },
	{ value: 'published', label: '게시됨' },
	{ value: 'archived', label: '보관됨' },
] as const;

// ===== 피드백 관련 =====
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
	{ value: 'mobile', label: '모바일 이슈' },
	{ value: 'other', label: '기타 의견' },
] as const;

// 피드백 라벨과 색상
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

// 피드백 필터용 (전체 옵션 포함)
export const FILTER_FEEDBACK_STATUS_OPTIONS = [
	{ value: 'all', label: '전체 상태' },
	...FEEDBACK_STATUS_OPTIONS,
] as const;

export const FILTER_FEEDBACK_CATEGORY_OPTIONS = [
	{ value: 'all', label: '전체 카테고리' },
	...FEEDBACK_CATEGORY_OPTIONS,
] as const;

// ===== 타입 정의 =====
export type FeedbackCategory = (typeof FEEDBACK_CATEGORY_OPTIONS)[number]['value'];
