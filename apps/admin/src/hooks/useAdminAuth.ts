import { useState, useEffect } from 'react';
import { adminAuthService } from '@/services';
import { supabase, type User } from '@pickid/supabase';

export function useAdminAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkAuth();

		// Supabase Auth 상태 변경 감지
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	const checkAuth = async () => {
		try {
			const session = await adminAuthService.getSession();
			setUser(session?.user ?? null);
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			const user = await adminAuthService.login(email, password);
			setUser(user);
			return { success: true } as const;
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : '로그인에 실패했습니다.',
			} as const;
		}
	};

	const logout = async () => {
		try {
			await adminAuthService.logout();
			setUser(null);
		} catch (error) {
			console.error('[useAdminAuth] Logout failed:', error);
			setUser(null);
		}
	};

	return {
		user,
		loading,
		login,
		logout,
		checkAuth,
		isAuthenticated: !!user,
	} as const;
}
