'use client';

import { useCallback, useContext } from 'react';
import { authService } from '@/api/services/auth.service';
import { SessionContext } from '@/providers/session.provider';
import type { AuthState } from '@/types';

export function useAuth(): AuthState & {
	signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
	signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
	signInWithKakao: () => Promise<void>;
	signOut: () => Promise<void>;
} {
	const context = useContext(SessionContext);

	if (!context) {
		throw new Error('useAuth must be used within SessionProvider');
	}

	const signIn = useCallback(async (email: string, password: string) => {
		try {
			await authService.signInWithPassword(email, password);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : '로그인에 실패했습니다.',
			};
		}
	}, []);

	const signUp = useCallback(async (email: string, password: string, name?: string) => {
		try {
			await authService.signUp(email, password, name);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : '회원가입에 실패했습니다.',
			};
		}
	}, []);

	const signInWithKakao = useCallback(async () => {
		await authService.signInWithKakao();
	}, []);

	const signOut = useCallback(async () => {
		try {
			await authService.signOut();
		} catch (error) {
			console.error('로그아웃 실패:', error);
		}
	}, []);

	return {
		...context,
		isAuthenticated: !!context.user,
		signIn,
		signUp,
		signInWithKakao,
		signOut,
	};
}
