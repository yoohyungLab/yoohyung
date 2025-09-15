// 건의사항 관련 상수들

export const FEEDBACK_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    REPLIED: 'replied',
    REJECTED: 'rejected',
} as const;

export const FEEDBACK_CATEGORY = {
    TEST_IDEA: 'test_idea',
    FEATURE: 'feature',
    BUG_REPORT: 'bug_report',
    DESIGN: 'design',
    MOBILE: 'mobile',
    OTHER: 'other',
} as const;

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

export const FEEDBACK_STATUS_OPTIONS = [
    { value: 'pending', label: '검토중' },
    { value: 'in_progress', label: '진행중' },
    { value: 'completed', label: '완료' },
    { value: 'replied', label: '답변완료' },
    { value: 'rejected', label: '반려' },
];
