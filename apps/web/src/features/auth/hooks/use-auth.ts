'use client';

import { useCallback, useContext } from 'react';

import { authService } from '@/shared/api/services/auth.service';
import { SessionContext } from '@/shared/providers/session.provider';

import type { AuthState } from '@/shared/types';

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
	}, []);

	// 회원가입 (에러는 throw)
	const signUp = useCallback(async (email: string, password: string, name?: string) => {
		await authService.signUp(email, password, name);
	}, []);

	// 카카오 로그인 (에러는 throw)
	const signInWithKakao = useCallback(async () => {
		await authService.signInWithKakao();
	}, []);

	// 로그아웃 (에러는 throw)
	const signOut = useCallback(async () => {
		await authService.signOut();
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
