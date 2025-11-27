import { useState, useEffect } from 'react';
import { adminAuthService } from '../services';
import { setAdminToken, ADMIN_TOKEN_KEY } from '../lib/admin-api';
import type { AdminUser } from '@pickid/supabase';

/**
 * 정석적인 JWT 인증 훅
 * - JWT 토큰만 localStorage에 저장
 * - 사용자 정보는 React 상태로만 관리 (localStorage 저장 안 함)
 * - 페이지 로드 시 토큰 검증하여 사용자 정보 가져오기
 */
export function useAdminAuth() {
	const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
	const [loading, setLoading] = useState(true);

	// 페이지 로드 시 토큰 검증
	useEffect(() => {
		const verifyToken = async () => {
			if (typeof window === 'undefined') {
				setLoading(false);
				return;
			}

			const token = localStorage.getItem(ADMIN_TOKEN_KEY);

			// 토큰이 없으면 인증되지 않음
			if (!token) {
				setAdminUser(null);
				setAdminToken(null);
				setLoading(false);
				return;
			}

			// 토큰 검증하여 사용자 정보 가져오기
			try {
				const user = await adminAuthService.verifyToken(token);
				setAdminUser(user);
				setAdminToken(token);
			} catch (error) {
				// 토큰이 유효하지 않으면 로그아웃 처리
				console.error('[Token Verification Error]', error);
				setAdminUser(null);
				setAdminToken(null);
				localStorage.removeItem(ADMIN_TOKEN_KEY);
			} finally {
				setLoading(false);
			}
		};

		verifyToken();
	}, []);

	const login = async (email: string, password: string) => {
		setLoading(true);
		try {
			const { token, user } = await adminAuthService.login(email, password);

			// JWT 토큰만 localStorage에 저장
			setAdminToken(token);
			// 사용자 정보는 상태로만 관리
			setAdminUser(user);

			return { success: true } as const;
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : '로그인에 실패했습니다.',
			} as const;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		await adminAuthService.logout();
		setAdminUser(null);
		setAdminToken(null);
		localStorage.removeItem(ADMIN_TOKEN_KEY);
	};

	return { adminUser, loading, login, logout } as const;
}
