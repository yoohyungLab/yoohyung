// 기존 상수들
export const PROFILE_STATUS = {
	ACTIVE: 'active',
	INACTIVE: 'inactive',
	DELETED: 'deleted',
} as const;

export const PROFILE_PROVIDER = {
	EMAIL: 'email',
	GOOGLE: 'google',
	KAKAO: 'kakao',
} as const;

export const PROFILE_PROVIDER_LABELS = {
	email: '이메일',
	google: '구글',
	kakao: '카카오',
} as const;

export const PAGINATION = {
	DEFAULT_PAGE_SIZE: 20,
	DEBOUNCE_DELAY: 300,
} as const;

// 모든 옵션 상수들 re-export
export * from './options';
// 필터 관련 상수들 re-export
export * from './filters';
