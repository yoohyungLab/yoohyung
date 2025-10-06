'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FeedbackList } from '@/features/feedback/ui/feedback-list';
import { useFeedbackList } from '@/features/feedback/hooks/useFeedback';
import { Button } from '@repo/ui';

function FeedbackPageContent() {
	const searchParams = useSearchParams();
	const showSuccess = searchParams?.get('success') === 'true';
	const { feedbacks, isLoading, error, hasMore, loadMore } = useFeedbackList();

	useEffect(() => {
		if (showSuccess) {
			const url = new URL(window.location.href);
			url.searchParams.delete('success');
			window.history.replaceState({}, '', url.toString());
		}
	}, [showSuccess]);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-5xl mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 mb-1">피드백</h1>
							<p className="text-sm text-gray-600">의견을 들려주세요</p>
						</div>
						<Link href="/feedback/new">
							<Button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-sm font-semibold rounded-lg">
								피드백 작성
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{showSuccess && (
				<div className="bg-blue-50 border-b border-blue-200">
					<div className="max-w-5xl mx-auto px-4 py-3">
						<p className="text-sm text-blue-900 font-medium">피드백이 제출되었습니다</p>
					</div>
				</div>
			)}

			<div className="max-w-5xl mx-auto px-4 py-6">
				{error ? (
					<div className="text-center py-16">
						<div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
							<span className="text-xl">⚠️</span>
						</div>
						<h3 className="text-base font-semibold text-gray-900 mb-1">오류가 발생했습니다</h3>
						<p className="text-sm text-gray-500 mb-4">{error}</p>
						<Button onClick={() => window.location.reload()} variant="outline" className="text-sm">
							다시 시도
						</Button>
					</div>
				) : isLoading && feedbacks.length === 0 ? (
					<div className="flex items-center justify-center py-16">
						<div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
					</div>
				) : (
					<FeedbackList feedbacks={feedbacks} onLoadMore={loadMore} hasMore={hasMore} isLoading={isLoading} />
				)}
			</div>
		</div>
	);
}

export default function FeedbackPage() {
	return <FeedbackPageContent />;
}
