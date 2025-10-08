'use client';

import { useContext, useCallback } from 'react';
import { SessionContext } from '@/shared/providers/session.provider';
import { authService } from '@/shared/api/services/auth.service';
import type { AuthState } from '@/shared/types/auth';

/**
 * 인증 ViewModel
 * - 사용자 인증 상태 관리
 * - 로그인/로그아웃 처리
 * - 권한 체크
 * - 도메인 규칙 적용
 */
export function useAuthVM(): AuthState & {
	// 인증 액션들 (로딩/에러 처리 포함)
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, name?: string) => Promise<void>;
	signInWithKakao: () => Promise<void>;
	signOut: () => Promise<void>;
} {
	const context = useContext(SessionContext);

	if (!context) {
		throw new Error('useAuthVM must be used within SessionProvider');
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

