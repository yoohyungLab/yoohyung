import { supabase } from '@pickid/supabase';
import type { AdminUser } from '@pickid/supabase';

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export const adminAuthService = {
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

		sessionStorage.setItem(TOKEN_KEY, data.token);
		sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));

		return data.user as AdminUser;
	},

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

	async logout() {
		const token = sessionStorage.getItem(TOKEN_KEY);

		if (token) {
			try {
				await supabase.rpc('admin_logout', { p_token: token });
			} catch {
			}
		}

		sessionStorage.removeItem(TOKEN_KEY);
		sessionStorage.removeItem(USER_KEY);
	},
};
