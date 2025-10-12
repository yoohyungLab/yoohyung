'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@pickid/supabase';
import { FeedbackForm } from '@/features/feedback';
import { Button } from '@pickid/ui';

export default function FeedbackCreatePage() {
	const [showSuccess, setShowSuccess] = useState(false);
	const router = useRouter();

	// 간단한 클라이언트 가드: 로그인 사용자만 접근
	// 비로그인 시 로그인 페이지로 라우팅 (SSR 리다이렉트 대신 깔끔한 클라이언트 전환)
	// 세션 컨텍스트가 있다면 사용하는 것이 이상적이나, 최소 변경으로 supabase 직접 사용
	// 흰 화면 방지를 위해 즉시 로딩 오버레이 없이 링크 전환만 수행
	// NOTE: 미들웨어에서 강제 리다이렉트를 제거했으므로 여기서만 보호

	useEffect(() => {
		const checkAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session) router.replace('/auth/login?next=/feedback/create');
		};
		checkAuth();
	}, [router]);

	const handleSuccess = () => {
		setShowSuccess(true);
		// 2초 후 피드백 목록으로 이동
		setTimeout(() => {
			router.push('/feedback');
		}, 2000);
	};

	if (showSuccess) {
		return (
			<main className="min-h-screen bg-gray-50 flex items-center justify-center">
				<section className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 text-center">
					<div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
						<span className="text-2xl" aria-hidden="true">
							✅
						</span>
					</div>
					<header>
						<h1 className="text-xl font-bold text-gray-900 mb-2">피드백이 제출되었습니다!</h1>
						<p className="text-gray-600 mb-4">소중한 의견 감사합니다.</p>
					</header>
					<p className="text-sm text-gray-500">잠시 후 피드백 목록으로 이동합니다...</p>
					<Button onClick={() => router.push('/feedback')} className="mt-4 w-full" variant="outline">
						지금 이동하기
					</Button>
				</section>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4">
				<FeedbackForm onSuccess={handleSuccess} />
			</div>
		</main>
	);
}
