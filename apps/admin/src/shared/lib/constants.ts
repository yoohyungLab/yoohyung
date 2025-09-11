export const PROFILE_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DELETED: 'deleted',
} as const;

export const FEEDBACK_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    REPLIED: 'replied',
    REJECTED: 'rejected',
} as const;

export const PROFILE_PROVIDER = {
    EMAIL: 'email',
    GOOGLE: 'google',
    KAKAO: 'kakao',
} as const;

export const PROFILE_STATUS_LABELS = {
    [PROFILE_STATUS.ACTIVE]: '활성',
    [PROFILE_STATUS.INACTIVE]: '비활성',
    [PROFILE_STATUS.DELETED]: '탈퇴',
} as const;

export const PROFILE_PROVIDER_LABELS = {
    [PROFILE_PROVIDER.EMAIL]: '이메일',
    [PROFILE_PROVIDER.GOOGLE]: '구글',
    [PROFILE_PROVIDER.KAKAO]: '카카오',
} as const;

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    DEBOUNCE_DELAY: 300,
} as const;
