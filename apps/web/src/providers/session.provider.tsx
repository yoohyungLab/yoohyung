'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { authService } from '@/api/services/auth.service';

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
		// 초기 세션 확인
		authService
			.getSession()
			.then(({ session }) => {
				setUser(session?.user ?? null);

				// 사용자 동기화
				if (session?.user) {
					authService.syncUserToPublic(session.user).catch(console.error);
				}
			})
			.catch(console.error)
			.finally(() => setLoading(false));

		// Auth 상태 변경 감지
		const subscription = authService.onAuthStateChange(async (event, session) => {
			setUser(session?.user ?? null);

			// 로그인/회원가입 시 사용자 동기화
			if (session?.user && (event === 'SIGNED_IN' || event === 'SIGNED_UP' || event === 'TOKEN_REFRESHED')) {
				await authService.syncUserToPublic(session.user).catch(console.error);
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	return <SessionContext.Provider value={{ user, loading }}>{children}</SessionContext.Provider>;
}
