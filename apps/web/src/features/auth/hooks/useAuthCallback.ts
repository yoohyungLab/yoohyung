'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/shared/api/services/auth.service';

interface AuthCallbackState {
	isLoading: boolean;
	error: string | null;
}

export function useAuthCallback() {
	const router = useRouter();
	const [state, setState] = useState<AuthCallbackState>({
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		const handleAuthCallback = async (): Promise<void> => {
			try {
				const { data, error } = await authService.getSession();

				if (error) {
					console.error('Auth callback error:', error);
					setState({ isLoading: false, error: 'auth_failed' });
					router.push('/auth/login?error=auth_failed');
					return;
				}

				if (data.session?.user) {
					console.log('Auth success:', data.session.user.email);
					router.push('/');
				} else {
					console.warn('No session found after auth callback');
					setState({ isLoading: false, error: 'no_session' });
					router.push('/auth/login?error=no_session');
				}
			} catch (error) {
				console.error('Auth callback processing failed:', error);
				setState({ isLoading: false, error: 'callback_failed' });
				router.push('/auth/login?error=callback_failed');
			}
		};

		handleAuthCallback();
	}, [router]);

	return state;
}

