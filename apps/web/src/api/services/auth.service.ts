import { supabase } from '@pickid/supabase';
import type { Session, User } from '@supabase/supabase-js';
import { Mutex } from 'async-mutex';

// Mutex for token refresh
const tokenRefreshMutex = new Mutex();

// Type re-exports
export type { Session, User };

/**
 * Auth Service - Supabase 기본 사용
 * - 토큰 갱신 시 Mutex로 동시성 제어
 */
export const authService = {
	async signInWithPassword(email: string, password: string) {
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			if (error.message === 'Invalid login credentials') {
				throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
			}
			throw new Error(error.message);
		}

		return data;
	},

	async signUp(email: string, password: string, name?: string) {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback`,
				data: name ? { name } : undefined,
			},
		});

		if (error) {
			throw new Error(error.message);
		}

		return data;
	},

	async signInWithKakao() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'kakao',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
				queryParams: {
					scope: 'profile_nickname profile_image account_email',
				},
			},
		});

		if (error) {
			throw new Error(`카카오 로그인 실패: ${error.message}`);
		}
	},

	async signOut() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			throw new Error(`로그아웃 실패: ${error.message}`);
		}
	},

	async getSession() {
		const { data, error } = await supabase.auth.getSession();

		if (error) {
			throw new Error(`세션 조회 실패: ${error.message}`);
		}

		return data;
	},

	/**
	 * 토큰 갱신 (Mutex로 동시성 제어)
	 */
	async refreshSession() {
		return tokenRefreshMutex.runExclusive(async () => {
			const { data, error } = await supabase.auth.refreshSession();

			if (error) {
				throw new Error(`토큰 갱신 실패: ${error.message}`);
			}

			return data;
		});
	},

	onAuthStateChange(callback: (event: string, session: Session | null) => void) {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(callback);
		return subscription;
	},

	async syncUserToPublic(user: User) {
		const { error } = await supabase.from('users').upsert({
			id: user.id,
			email: user.email,
			name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
			provider: user.app_metadata?.provider || 'email',
			status: 'active',
			avatar_url: user.user_metadata?.avatar_url || null,
			created_at: user.created_at,
			updated_at: new Date().toISOString(),
		});

		if (error) {
			throw new Error(`사용자 동기화 실패: ${error.message}`);
		}
	},
};
