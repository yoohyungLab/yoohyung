// src/shared/providers/session.provider.tsx
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { authService } from '@/shared/api/services/auth.service';

// 세션 상태 타입 - Supabase User 타입 기반
interface SessionState {
	user: User | null;
	session: null; // 현재는 session을 사용하지 않음
	loading: boolean;
}

// SessionContext 생성
export const SessionContext = createContext<SessionState | undefined>(undefined);

interface SessionProviderProps {
	children: ReactNode;
}

function setAuthCookie(value: '1' | '', maxAgeSeconds?: number) {
	const maxAge = typeof maxAgeSeconds === 'number' ? `; Max-Age=${maxAgeSeconds}` : '';
	document.cookie = `pickid_auth=${value}; Path=/; SameSite=Lax${maxAge}`;
}

export function SessionProvider({ children }: SessionProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 사용자 동기화 함수
		const syncUserToPublic = async (user: User) => {
			try {
				const result = await authService.syncUserToPublic(user);
				if (result?.error) {
					console.error('사용자 동기화 실패:', result.error);
				}
			} catch (error) {
				console.error('사용자 동기화 중 오류:', error);
			}
		};

		// 초기 세션 확인
		const initSession = async () => {
			try {
				const { data } = await authService.getSession();
				const currentUser = data.session?.user ?? null;
				setUser(currentUser);

				// 로그인된 사용자가 있으면 동기화
				if (currentUser) {
					await syncUserToPublic(currentUser);
					setAuthCookie('1', 3600 * 24 * 7);
				} else {
					setAuthCookie('', 0);
				}
			} catch (error) {
				console.error('Session init failed:', error);
				setUser(null);
				setAuthCookie('', 0);
			} finally {
				setLoading(false);
			}
		};

		initSession();

		// 인증 상태 변화 감지
		const subscription = authService.onAuthStateChange(async (event, session) => {
			const currentUser = session?.user ?? null;
			setUser(currentUser);

			// 로그인/회원가입 시 사용자 동기화
			if (currentUser && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
				await syncUserToPublic(currentUser);
				setAuthCookie('1', 60 * 60 * 24 * 7);
			} else if (!currentUser || event === 'SIGNED_OUT') {
				setAuthCookie('', 0);
			}

			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	// user, session, loading 제공
	return (
		<SessionContext.Provider
			value={{
				user,
				session: null, // 현재는 session을 사용하지 않음
				loading,
			}}
		>
			{children}
		</SessionContext.Provider>
	);
}
