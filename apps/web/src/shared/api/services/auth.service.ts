import { supabase } from '@repo/shared';

// Auth Service - API 호출만 담당
export const authService = {
	// OAuth 로그인
	async signInWithOAuth(provider: 'kakao' | 'google') {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});

		if (error) throw error;
		return { data, error: null };
	},

	// 이메일 로그인
	async signInWithPassword(email: string, password: string) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw error;
		return { data, error: null };
	},

	// 회원가입
	async signUp(email: string, password: string, name: string) {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { name },
			},
		});

		if (error) throw error;
		return { data, error: null };
	},

	// 로그아웃
	async signOut() {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
	},

	// 현재 사용자 조회
	async getCurrentUser() {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();
		if (error) throw error;
		return { user, error: null };
	},

	// 프로필 조회
	async getProfile(userId: string) {
		const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

		if (error) throw error;
		return { data, error: null };
	},

	// 프로필 생성/업데이트
	async upsertProfile(profileData: Record<string, unknown>) {
		const { data, error } = await supabase.from('profiles').upsert(profileData).select().single();

		if (error) throw error;
		return { data, error: null };
	},

	// 사용자 메타데이터 업데이트
	async updateUserMetadata(updates: Record<string, unknown>) {
		const { data, error } = await supabase.auth.updateUser({
			data: updates,
		});

		if (error) throw error;
		return { data, error: null };
	},
};
