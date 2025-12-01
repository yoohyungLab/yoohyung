export const CATEGORY_STATUSES = {
	active: { value: 'active', label: '활성', variant: 'success' as const },
	inactive: { value: 'inactive', label: '비활성', variant: 'outline' as const },
} as const;

export type CategoryStatus = keyof typeof CATEGORY_STATUSES;

export const CATEGORY_STATUS_VALUES = {
	ACTIVE: 'active',
	INACTIVE: 'inactive',
	ALL: 'all',
} as const;
