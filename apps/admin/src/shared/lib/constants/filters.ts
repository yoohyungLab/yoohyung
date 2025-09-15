// 필터 관련 상수들
export const FILTER_STATUS_OPTIONS = [
    { value: 'all', label: '전체 상태' },
    { value: 'active', label: '활성' },
    { value: 'inactive', label: '비활성' },
    { value: 'deleted', label: '탈퇴' },
] as const;

export const FILTER_PROVIDER_OPTIONS = [
    { value: 'all', label: '전체 가입경로' },
    { value: 'email', label: '이메일' },
    { value: 'google', label: '구글' },
    { value: 'kakao', label: '카카오' },
] as const;

export const FILTER_FEEDBACK_STATUS_OPTIONS = [
    { value: 'all', label: '전체 상태' },
    { value: 'pending', label: '검토중' },
    { value: 'in_progress', label: '진행중' },
    { value: 'completed', label: '완료' },
    { value: 'replied', label: '답변완료' },
    { value: 'rejected', label: '반려' },
] as const;

export const FILTER_FEEDBACK_CATEGORY_OPTIONS = [
    { value: 'all', label: '전체 카테고리' },
    { value: 'test_idea', label: '새 테스트 아이디어' },
    { value: 'feature', label: '기능 개선 건의' },
    { value: 'bug_report', label: '오류 신고' },
    { value: 'design', label: '디자인 관련' },
    { value: 'mobile', label: '모바일 이슈' },
    { value: 'other', label: '기타 의견' },
] as const;

export const FILTER_TEST_STATUS_OPTIONS = [
    { value: 'all', label: '전체 상태' },
    { value: 'draft', label: '초안' },
    { value: 'published', label: '게시됨' },
    { value: 'archived', label: '보관됨' },
] as const;

// 검색 관련
export const SEARCH_PLACEHOLDERS = {
    USER: '이메일 또는 이름으로 검색',
    FEEDBACK: '제목 또는 내용으로 검색',
    TEST: '테스트명으로 검색',
    CATEGORY: '카테고리명으로 검색',
} as const;
