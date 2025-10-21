import { supabase } from '@pickid/supabase';
import type { Session, User } from '@supabase/supabase-js';

// ============================================================================
// 타입 정의
// ============================================================================

export interface AuthResponse {
	data: {
		user: User | null;
		session: Session | null;
	} | null;
	error: null;
}

export interface SignUpResponse {
	data: {
		user: User | null;
		session: Session | null;
	} | null;
	error: null;
}

export interface SignOutResponse {
	error: null;
}

export interface SessionResponse {
	data: {
		session: Session | null;
	};
	error: null;
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

// ============================================================================
// Auth Service - 순수한 API 호출만 담당
// ============================================================================

export const authService = {
	/**
	 * 이메일 로그인
	 */
	async signInWithPassword(email: string, password: string): Promise<AuthResponse> {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;
			return { data, error: null };
		} catch (error) {
			handleSupabaseError(error, 'signInWithPassword');
			return { data: null, error: null };
		}
	},

	/**
	 * 회원가입
	 */
	async signUp(email: string, password: string, name?: string): Promise<SignUpResponse> {
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`,
					data: name ? { name } : undefined,
				},
			});

			if (error) throw error;
			return { data, error: null };
		} catch (error) {
			handleSupabaseError(error, 'signUp');
			return { data: null, error: null };
		}
	},

	/**
	 * 카카오 OAuth 로그인
	 */
	async signInWithKakao(): Promise<SignOutResponse> {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'kakao',
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
					queryParams: {
						scope: 'profile_nickname profile_image account_email',
					},
				},
			});

			if (error) throw error;
			return { error: null };
		} catch (error) {
			handleSupabaseError(error, 'signInWithKakao');
			return { error: null };
		}
	},

	/**
	 * 로그아웃
	 */
	async signOut(): Promise<SignOutResponse> {
		try {
			const { error } = await supabase.auth.signOut();

			if (error) throw error;
			return { error: null };
		} catch (error) {
			handleSupabaseError(error, 'signOut');
			return { error: null };
		}
	},

	/**
	 * 현재 세션 조회
	 */
	async getSession(): Promise<SessionResponse> {
		try {
			const { data, error } = await supabase.auth.getSession();

			if (error) throw error;
			return { data, error: null };
		} catch (error) {
			handleSupabaseError(error, 'getSession');
			return { data: { session: null }, error: null };
		}
	},

	/**
	 * 인증 상태 변화 감지
	 */
	onAuthStateChange(callback: (event: string, session: Session | null) => void) {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(callback);
		return subscription;
	},

	/**
	 * 사용자 정보를 public.users 테이블에 동기화
	 */
	async syncUserToPublic(user: User) {
		try {
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

			return { error };
		} catch (error) {
			handleSupabaseError(error, 'syncUserToPublic');
		}
	},
};
