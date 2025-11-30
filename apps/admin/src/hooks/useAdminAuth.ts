import { useState, useEffect } from 'react';
import { adminAuthService } from '../services';
import type { AdminUser } from '@pickid/supabase';

export function useAdminAuth() {
	const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const user = await adminAuthService.getCurrentAdmin();
			setAdminUser(user);
		} catch (error) {
			console.error('[Auth Check Error]', error);
			setAdminUser(null);
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			const user = await adminAuthService.login(email, password);
			setAdminUser(user);
			return { success: true } as const;
		} catch (err) {
			console.error('[Login Error]', err);
			return {
				success: false,
				error: err instanceof Error ? err.message : '로그인에 실패했습니다.',
			} as const;
		}
	};

	const logout = async () => {
		try {
			await adminAuthService.logout();
			setAdminUser(null);
		} catch (error) {
			console.error('[Logout Error]', error);
			setAdminUser(null);
		}
	};

	return { adminUser, loading, login, logout, checkAuth } as const;
}
