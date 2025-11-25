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

export const USER_STATUS_OPTIONS = [
	{ value: 'active', label: '활성' },
	{ value: 'inactive', label: '비활성' },
	{ value: 'deleted', label: '탈퇴' },
] as const;

export const USER_PROVIDER_OPTIONS = [
	{ value: 'email', label: '이메일' },
	{ value: 'kakao', label: '카카오' },
] as const;

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

export const FILTER_USER_STATUS_OPTIONS = [{ value: 'all', label: '전체 상태' }, ...USER_STATUS_OPTIONS] as const;

export const FILTER_USER_PROVIDER_OPTIONS = [
	{ value: 'all', label: '전체 가입경로' },
	...USER_PROVIDER_OPTIONS,
] as const;
