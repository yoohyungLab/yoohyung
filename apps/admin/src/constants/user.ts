

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

export const PROFILE_STATUS_CONFIG = {
	[PROFILE_STATUS.ACTIVE]: { text: '활성', color: 'bg-emerald-500 text-white', icon: '✅' },
	[PROFILE_STATUS.INACTIVE]: { text: '비활성', color: 'bg-slate-500 text-white', icon: '❌' },
	[PROFILE_STATUS.DELETED]: { text: '탈퇴', color: 'bg-rose-500 text-white', icon: '🗑️' },
} as const;

export const USER_STATUS_OPTIONS = [
	{ value: PROFILE_STATUS.ACTIVE, label: PROFILE_STATUS_CONFIG[PROFILE_STATUS.ACTIVE].text },
	{ value: PROFILE_STATUS.INACTIVE, label: PROFILE_STATUS_CONFIG[PROFILE_STATUS.INACTIVE].text },
	{ value: PROFILE_STATUS.DELETED, label: PROFILE_STATUS_CONFIG[PROFILE_STATUS.DELETED].text },
] as const;

export const USER_PROVIDER_OPTIONS = [
	{ value: PROFILE_PROVIDER.EMAIL, label: PROFILE_PROVIDER_LABELS.email },
	{ value: PROFILE_PROVIDER.GOOGLE, label: PROFILE_PROVIDER_LABELS.google },
	{ value: PROFILE_PROVIDER.KAKAO, label: PROFILE_PROVIDER_LABELS.kakao },
] as const;

export const FILTER_USER_STATUS_OPTIONS = [{ value: 'all', label: '전체 상태' }, ...USER_STATUS_OPTIONS] as const;

export const FILTER_USER_PROVIDER_OPTIONS = [
	{ value: 'all', label: '전체 가입경로' },
	...USER_PROVIDER_OPTIONS,
] as const;
