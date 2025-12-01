'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFeedbackDetail } from '@/app/feedback/hooks/useFeedback';
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '@/constants/feedback';
import { ROUTES } from '@/constants';
import { Button } from '@pickid/ui';
import { ArrowLeft } from 'lucide-react';

export default function FeedbackDetailPage() {
	const params = useParams();
	const router = useRouter();
	const { data: feedback, isLoading, error } = useFeedbackDetail(params?.id as string);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-2 text-gray-600">로딩 중...</p>
				</div>
			</div>
		);
	}

	if (error || !feedback) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-2">피드백을 찾을 수 없어요</h1>
					<p className="text-gray-600 mb-4">요청하신 피드백이 존재하지 않습니다</p>
					<div className="space-x-4">
						<Button onClick={() => router.back()} text="뒤로가기" />
						<Button onClick={() => router.push(ROUTES.HOME)} text="홈으로" />
					</div>
				</div>
			</div>
		);
	}

	const categoryKey = feedback.category as keyof typeof FEEDBACK_CATEGORIES;
	const categoryInfo = FEEDBACK_CATEGORIES[categoryKey] ?? FEEDBACK_CATEGORIES.OTHER;
	const statusKey = feedback.status as keyof typeof FEEDBACK_STATUSES;
	const statusInfo = FEEDBACK_STATUSES[statusKey] ?? FEEDBACK_STATUSES.PENDING;

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-4xl mx-auto px-4 py-4">
					<button
						onClick={() => router.back()}
						className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
					>
						<ArrowLeft className="w-4 h-4" />
						뒤로가기
					</button>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 py-6">
				<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
					<div className="p-6 border-b border-gray-200">
						<div className="flex items-start gap-4">
							<div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-xl">
								{categoryInfo.EMOJI}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-2">
									<span className="text-xs font-semibold text-gray-600">{categoryInfo.LABEL}</span>
									<span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusInfo.CLASS_NAME}`}>
										{statusInfo.LABEL}
									</span>
								</div>
								<h1 className="text-xl font-bold text-gray-900 mb-2">{feedback.title as string}</h1>
								<div className="text-xs text-gray-500">
									{(feedback.author_name as string) || '익명'} ·{' '}
									{new Date(feedback.created_at as string).toLocaleString('ko-KR', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</div>
							</div>
						</div>
					</div>

					<div className="p-6">
						<div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
							{feedback.content as string}
						</div>
					</div>

					{(feedback.admin_reply as string)?.trim() && (
						<div className="mx-6 mb-6 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
							<div className="bg-blue-100 px-4 py-2 border-b border-blue-200">
								<div className="flex items-center gap-2">
									<div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
										<span className="text-white text-[10px] font-bold">A</span>
									</div>
									<span className="text-xs font-bold text-blue-900">관리자 답변</span>
									{feedback.admin_reply_at && (
										<span className="text-[10px] text-blue-600 ml-auto">
											{new Date(feedback.admin_reply_at as string).toLocaleString('ko-KR', {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
									)}
								</div>
							</div>
							<div className="p-4">
								<div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
									{feedback.admin_reply as string}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
