'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { authService } from '@/api/services/auth.service';

// 세션 프로바이더

interface SessionState {
	user: User | null;
	loading: boolean;
}

export const SessionContext = createContext<SessionState | undefined>(undefined);

interface SessionProviderProps {
	children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 인증 쿠키 설정 함수
		const setAuthCookie = (isAuthenticated: boolean) => {
			if (typeof document !== 'undefined') {
				if (isAuthenticated) {
					// 인증 성공: 쿠키 설정 (1년)
					document.cookie = 'pickid_auth=1; path=/; max-age=31536000; SameSite=Lax';
				} else {
					// 로그아웃: 쿠키 삭제
					document.cookie = 'pickid_auth=; path=/; max-age=0';
				}
			}
		};

		// 초기 세션 확인
		authService
			.getSession()
			.then(({ session }) => {
				setUser(session?.user ?? null);
				setAuthCookie(!!session?.user);
			})
			.catch(console.error)
			.finally(() => setLoading(false));

		// Auth 상태 변경 감지
		const subscription = authService.onAuthStateChange(async (event, session) => {
			setUser(session?.user ?? null);
			setAuthCookie(!!session?.user);
		});

		return () => subscription.unsubscribe();
	}, []);

	return <SessionContext.Provider value={{ user, loading }}>{children}</SessionContext.Provider>;
}
