export const CATEGORY_STATUS_VALUES = {
	ACTIVE: 'active',
	INACTIVE: 'inactive',
	ALL: 'all',
} as const;

export const CATEGORY_STATUS_OPTIONS = [
	{ value: CATEGORY_STATUS_VALUES.ACTIVE, label: '활성' },
	{ value: CATEGORY_STATUS_VALUES.INACTIVE, label: '비활성' },
] as const;



export const FILTER_CATEGORY_STATUS_OPTIONS = [
	{ value: CATEGORY_STATUS_VALUES.ALL, label: '전체 상태' },
	...CATEGORY_STATUS_OPTIONS,
] as const;
