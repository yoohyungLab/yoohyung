import type { AdminUser } from '@pickid/supabase';

export interface AdminLoginResponse {
	token: string;
	user: AdminUser;
}

/**
 * Admin Auth Service - Edge Function 기반 JWT 인증
 * Supabase 권장 방식: Edge Function에서 JWT 생성
 */
export const adminAuthService = {
	/**
	 * 로그인 - Edge Function으로 로그인하고 JWT 토큰 + 사용자 정보 반환
	 */
	async login(email: string, password: string): Promise<AdminLoginResponse> {
		const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
		if (!supabaseUrl) {
			throw new Error('Supabase URL이 설정되지 않았습니다.');
		}

		const response = await fetch(`${supabaseUrl}/functions/v1/admin-login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
			},
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: '로그인에 실패했습니다.' }));
			throw new Error(error.error || '이메일 또는 비밀번호가 올바르지 않습니다.');
		}

		const data = await response.json();

		if (!data || !data.token || !data.user) {
			throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
		}

		return {
			token: data.token,
			user: data.user as AdminUser,
		};
	},

	/**
	 * 토큰 검증 - Edge Function으로 JWT 토큰의 유효성을 검증하고 사용자 정보 반환
	 */
	async verifyToken(token: string): Promise<AdminUser> {
		const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
		if (!supabaseUrl) {
			throw new Error('Supabase URL이 설정되지 않았습니다.');
		}

		const response = await fetch(`${supabaseUrl}/functions/v1/admin-verify`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: '토큰 검증에 실패했습니다.' }));
			throw new Error(error.error || '토큰이 유효하지 않습니다.');
		}

		const data = await response.json();

		if (!data) {
			throw new Error('토큰이 유효하지 않습니다.');
		}

		return data as AdminUser;
	},

	/**
	 * 로그아웃 - 클라이언트 상태만 초기화
	 */
	async logout() {
		// 클라이언트 상태만 초기화
	},
};
