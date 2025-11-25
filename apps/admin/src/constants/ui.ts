/**
 * @file ui.ts
 * @description UI 관련 상수
 * @deprecated 대부분의 상수는 packages/shared로 이동했습니다.
 * - 색상: @pickid/shared의 COLORS, STATS_CARD_THEMES 사용
 * - 메시지: @pickid/shared의 *_MESSAGES 사용
 */

// ===== 페이지네이션 설정 =====
// Note: shared/lib/constants에도 정의되어 있으나 호환성을 위해 유지
export const PAGINATION = {
	DEFAULT_PAGE_SIZE: 20,
	MAX_PAGE_SIZE: 100,
	PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
	DEBOUNCE_DELAY: 300,
} as const;

