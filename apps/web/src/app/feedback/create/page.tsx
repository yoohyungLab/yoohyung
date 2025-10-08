'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FeedbackForm } from '@/features/feedback/ui/feedback-form';
import { Button } from '@pickid/ui';

export default function FeedbackCreatePage() {
	const [showSuccess, setShowSuccess] = useState(false);
	const router = useRouter();

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
