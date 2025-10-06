// src/shared/providers/session.provider.tsx
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { authService } from '@/shared/api/services/auth.service';

// 세션 상태 타입 - user만 노출 (AuthState의 일부)
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

export function SessionProvider({ children }: SessionProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 초기 세션 확인
		const initSession = async () => {
			try {
				const { data } = await authService.getSession();
				setUser(data.session?.user ?? null);
			} catch (error) {
				console.error('Session init failed:', error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		initSession();

		// 인증 상태 변화 감지
		const subscription = authService.onAuthStateChange((event, session) => {
			console.log('Session changed:', event, session?.user?.email);
			setUser(session?.user ?? null);
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
