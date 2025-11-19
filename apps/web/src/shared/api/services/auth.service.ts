import { supabase } from '@pickid/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { AuthResponse, SignUpResponse, SignOutResponse, SessionResponse } from '@pickid/supabase';
import { handleSupabaseError } from '@/shared/lib';

export const authService = {
	async signInWithPassword(email: string, password: string): Promise<AuthResponse> {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
			return { data, error: null };
		} catch (error) {
			handleSupabaseError(error, 'signInWithPassword');
			return { data: null, error: null };
		}
	},

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

	onAuthStateChange(callback: (event: string, session: Session | null) => void) {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(callback);
		return subscription;
	},

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
