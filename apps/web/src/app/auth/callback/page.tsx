'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

function AuthCallbackContent() {
	const router = useRouter();

	useEffect(() => {
		const handleAuthCallback = async () => {
			try {
				const supabase = createBrowserClient(
					process.env.NEXT_PUBLIC_SUPABASE_URL!,
					process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
				);

				// URL에서 인증 코드 처리
				const { data, error } = await supabase.auth.getSession();

				if (error) {
					console.error('Auth callback error:', error);
					router.push('/auth/login?error=auth_failed');
					return;
				}

				if (data.session?.user) {
					console.log('Auth success:', data.session.user.email);
					router.push('/');
				} else {
					console.warn('No session found after auth callback');
					router.push('/auth/login?error=no_session');
				}
			} catch (error) {
				console.error('Auth callback processing failed:', error);
				router.push('/auth/login?error=callback_failed');
			}
		};

		handleAuthCallback();
	}, [router]);

	// 로딩 화면
	return (
		<div className="min-h-screen bg-white flex items-center justify-center">
			<div className="text-center">
				<div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p className="text-gray-600">인증 처리 중...</p>
			</div>
		</div>
	);
}

export default function AuthCallbackPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-white flex items-center justify-center">
					<div className="text-center">
						<div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-600">로딩 중...</p>
					</div>
				</div>
			}
		>
			<AuthCallbackContent />
		</Suspense>
	);
}
