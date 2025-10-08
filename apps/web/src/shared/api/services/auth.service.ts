import type { Session } from '@supabase/supabase-js';
import { supabase } from '@pickid/shared';

// Auth Service - 순수한 API 호출만 담당
export const authService = {
	// 이메일 로그인
	async signInWithPassword(email: string, password: string) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error('Sign in error:', error);
			throw error;
		}

		return { data, error: null };
	},

	// 회원가입
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
			console.error('Sign up error:', error);
			throw error;
		}

		return { data, error: null };
	},

	// 카카오 OAuth 로그인
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
			console.error('Kakao OAuth error:', error);
			throw error;
		}

		return { error: null };
	},

	// 로그아웃
	async signOut() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error('Sign out error:', error);
			throw error;
		}

		return { error: null };
	},

	// 현재 세션 조회
	async getSession() {
		const { data, error } = await supabase.auth.getSession();

		if (error) {
			console.error('Get session error:', error);
			throw error;
		}

		return { data, error: null };
	},

	// 인증 상태 변화 감지
	onAuthStateChange(callback: (event: string, session: Session | null) => void) {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(callback);
		return subscription;
	},
};
