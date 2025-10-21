'use client';

import Link from 'next/link';
import { FeedbackList } from '@/features/feedback';
import { useFeedbackList } from '@/features/feedback';
import { Button } from '@pickid/ui';

export function FeedbackContainer() {
	const { feedbacks, isLoading, error } = useFeedbackList();

	return (
		<main className="min-h-screen bg-gray-50">
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-5xl mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 mb-1">피드백</h1>
							<p className="text-sm text-gray-600">의견을 들려주세요</p>
						</div>
						<Link href="/feedback/create">
							<Button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-sm font-semibold rounded-lg">
								피드백 작성
							</Button>
						</Link>
					</div>
				</div>
			</header>

			<section className="max-w-5xl mx-auto px-4 py-6">
				{error ? (
					<div className="text-center py-16" role="alert">
						<div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
							<span className="text-xl" aria-hidden="true">
								⚠️
							</span>
						</div>
						<h2 className="text-base font-semibold text-gray-900 mb-1">오류가 발생했습니다</h2>
						<p className="text-sm text-gray-500 mb-4">{error}</p>
						<Button onClick={() => window.location.reload()} variant="outline" className="text-sm">
							다시 시도
						</Button>
					</div>
				) : isLoading ? (
					<div className="flex items-center justify-center py-16" aria-label="로딩 중">
						<div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
					</div>
				) : (
					<FeedbackList feedbacks={feedbacks} />
				)}
			</section>
		</main>
	);
}
