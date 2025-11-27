import { supabase } from '@pickid/supabase';
import type { AdminUser } from '@pickid/supabase';

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

/**
 * Admin Auth Service - RPC 함수만 사용 (간단)
 */
export const adminAuthService = {
	/**
	 * 로그인 - RPC로 세션 토큰 생성
	 */
	async login(email: string, password: string): Promise<AdminUser> {
		const { data, error } = await supabase.rpc('admin_login', {
			p_email: email,
			p_password: password,
		});

		if (error) {
			throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
		}

		if (!data || !data.token || !data.user) {
			throw new Error('로그인에 실패했습니다.');
		}

		// 세션에 저장
		sessionStorage.setItem(TOKEN_KEY, data.token);
		sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));

		return data.user as AdminUser;
	},

	/**
	 * 세션 확인 - RPC로 토큰 검증
	 */
	async getCurrentAdmin(): Promise<AdminUser | null> {
		const token = sessionStorage.getItem(TOKEN_KEY);
		if (!token) return null;

		try {
			const { data, error } = await supabase.rpc('admin_verify_session', {
				p_token: token,
			});

			if (error || !data) {
				this.logout();
				return null;
			}

			sessionStorage.setItem(USER_KEY, JSON.stringify(data));
			return data as AdminUser;
		} catch {
			this.logout();
			return null;
		}
	},

	/**
	 * 로그아웃 - RPC로 세션 삭제
	 */
	async logout() {
		const token = sessionStorage.getItem(TOKEN_KEY);

		if (token) {
			try {
				await supabase.rpc('admin_logout', { p_token: token });
			} catch {
				// 무시
			}
		}

		sessionStorage.removeItem(TOKEN_KEY);
		sessionStorage.removeItem(USER_KEY);
	},
};
