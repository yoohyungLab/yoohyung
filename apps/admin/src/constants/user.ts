// ============================================
// constants/user.ts
// 유저 관련 설정
// ============================================

export const USER_STATUSES = {
	active: { value: 'active', label: '활성', variant: 'success' as const, icon: '✅' },
	inactive: { value: 'inactive', label: '비활성', variant: 'outline' as const, icon: '❌' },
	deleted: { value: 'deleted', label: '탈퇴', variant: 'destructive' as const, icon: '🗑️' },
} as const;

export type UserStatus = keyof typeof USER_STATUSES;

export const USER_PROVIDERS = {
	email: { value: 'email', label: '이메일' },
	google: { value: 'google', label: '구글' },
	kakao: { value: 'kakao', label: '카카오' },
} as const;

export type UserProvider = keyof typeof USER_PROVIDERS;

// 레거시 호환성 (기존 코드에서 사용 중)
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
