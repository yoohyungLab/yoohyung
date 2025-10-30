'use client';

import { useCallback, useContext } from 'react';

import { authService } from '@/shared/api/services/auth.service';
import { SessionContext } from '@/shared/providers/session.provider';

import type { AuthState } from '@/shared/types';

function setAuthCookie(value: '1' | '', maxAgeSeconds?: number) {
	const maxAge = typeof maxAgeSeconds === 'number' ? `; Max-Age=${maxAgeSeconds}` : '';
	document.cookie = `pickid_auth=${value}; Path=/; SameSite=Lax${maxAge}`;
}

export function useAuth(): AuthState & {
	// 인증 액션들 (로딩/에러 처리 포함)
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, name?: string) => Promise<void>;
	signInWithKakao: () => Promise<void>;
	signOut: () => Promise<void>;
} {
	const context = useContext(SessionContext);

	if (!context) {
		throw new Error('useAuth must be used within SessionProvider');
	}

	// 로그인 (에러는 throw)
	const signIn = useCallback(async (email: string, password: string) => {
		await authService.signInWithPassword(email, password);
		// 세션은 클라이언트 저장이므로, 미들웨어 판별용 쿠키 설정
		setAuthCookie('1', 60 * 60 * 24 * 7); // 7일
	}, []);

	// 회원가입 (에러는 throw)
	const signUp = useCallback(async (email: string, password: string, name?: string) => {
		await authService.signUp(email, password, name);
		setAuthCookie('1', 60 * 60 * 24 * 7);
	}, []);

	// 카카오 로그인 (에러는 throw)
	const signInWithKakao = useCallback(async () => {
		await authService.signInWithKakao();
		// 외부 리다이렉트 전 쿠키를 미리 설정 (콜백 후에도 유지)
		setAuthCookie('1', 60 * 60 * 24 * 7);
	}, []);

	// 로그아웃 (에러는 throw)
	const signOut = useCallback(async () => {
		await authService.signOut();
		// 쿠키 삭제
		setAuthCookie('', 0);
	}, []);

	return {
		...context,
		isAuthenticated: !!context.user,

		// 인증 액션들
		signIn,
		signUp,
		signInWithKakao,
		signOut,
	};
}
