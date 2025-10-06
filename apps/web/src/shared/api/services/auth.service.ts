import { createBrowserClient } from '@supabase/ssr';
import type { Session } from '@supabase/supabase-js';

// 환경 변수 확인 및 기본값 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수 검증
if (!supabaseUrl) {
	throw new Error('NEXT_PUBLIC_SUPABASE_URL 환경 변수가 설정되지 않았습니다.');
}
if (!supabaseAnonKey) {
	throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY 환경 변수가 설정되지 않았습니다.');
}

// Supabase 클라이언트 생성
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

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
