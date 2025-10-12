// src/shared/providers/session.provider.tsx
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { authService } from '@/shared/api/services/auth.service';
import { supabase } from '@pickid/supabase';

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
		// 사용자 동기화 함수
		const syncUserToPublic = async (user: User) => {
			try {
				const { error } = await supabase.from('users').upsert({
					id: user.id,
					email: user.email,
					name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
					provider: user.app_metadata?.provider || 'email',
					status: 'active',
					avatar_url: user.user_metadata?.avatar_url || null,
					created_at: user.created_at,
					updated_at: new Date().toISOString(),
				});

				if (error) {
					console.error('사용자 동기화 실패:', error);
				} else {
					console.log('사용자 동기화 성공:', user.email);
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
				}
			} catch (error) {
				console.error('Session init failed:', error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		initSession();

		// 인증 상태 변화 감지
		const subscription = authService.onAuthStateChange(async (event, session) => {
			console.log('Session changed:', event, session?.user?.email);

			const currentUser = session?.user ?? null;
			setUser(currentUser);

			// 로그인/회원가입 시 사용자 동기화
			if (currentUser && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
				await syncUserToPublic(currentUser);
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
