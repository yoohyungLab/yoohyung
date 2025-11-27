/**
 * Admin API 유틸리티
 * JWT 토큰을 포함한 API 요청 헬퍼
 */

export const ADMIN_TOKEN_KEY = 'admin_token';

/**
 * Admin JWT 토큰 설정
 */
export function setAdminToken(token: string | null) {
	if (typeof window === 'undefined') return;

	if (token) {
		localStorage.setItem(ADMIN_TOKEN_KEY, token);
	} else {
		localStorage.removeItem(ADMIN_TOKEN_KEY);
	}
}

/**
 * Admin JWT 토큰 가져오기
 */
export function getAdminToken(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem(ADMIN_TOKEN_KEY);
}

/**
 * Authorization 헤더 생성
 */
export function getAuthHeaders(): Record<string, string> {
	const token = getAdminToken();
	if (!token) {
		return {};
	}
	return {
		Authorization: `Bearer ${token}`,
	};
}
