// ============================================
// constants/common.ts
// 공통 설정 (페이지네이션 등)
// ============================================

export const PAGINATION = {
	pageSize: 20,
	maxPageSize: 100,
	pageSizeOptions: [10, 20, 50, 100] as const,
	debounceDelay: 300,
} as const;

