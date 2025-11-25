import { supabase, type User } from '@pickid/supabase';
import { Mutex } from 'async-mutex';

// Mutex for token refresh
const tokenRefreshMutex = new Mutex();

export const adminAuthService = {
	async login(email: string, password: string): Promise<User> {
		// 1. Supabase Auth로 로그인
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email.toLowerCase(),
			password,
		});

		if (error) {
			throw new Error(
				error.message === 'Invalid login credentials' ? '이메일 또는 비밀번호가 올바르지 않습니다.' : error.message
			);
		}

		if (!data.user) {
			throw new Error('로그인에 실패했습니다.');
		}

		// 2. admin_users 테이블에서 관리자 권한 확인
		const { data: adminData, error: adminError } = await supabase
			.from('admin_users')
			.select('is_active')
			.eq('email', email.toLowerCase())
			.eq('is_active', true)
			.single();

		if (adminError || !adminData) {
			await supabase.auth.signOut();
			throw new Error('관리자 권한이 없습니다.');
		}

		return data.user;
	},

	async logout(): Promise<void> {
		await supabase.auth.signOut();
	},

	async getSession() {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		return session;
	},

	async getCurrentUser() {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		return user;
	},

	/**
	 * 토큰 갱신 (Mutex로 동시성 제어)
	 */
	async refreshSession() {
		return tokenRefreshMutex.runExclusive(async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.refreshSession();

			if (error || !session) {
				throw new Error('Token refresh failed');
			}

			return session;
		});
	},

	async isAdmin(): Promise<boolean> {
		const session = await this.getSession();
		if (!session?.user?.email) return false;

		const { data } = await supabase
			.from('admin_users')
			.select('is_active')
			.eq('email', session.user.email)
			.eq('is_active', true)
			.single();

		return !!data;
	},
};
