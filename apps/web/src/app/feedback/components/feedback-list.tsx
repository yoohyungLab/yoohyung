'use client';

import Link from 'next/link';
import { Feedback } from '@pickid/supabase';
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '@/constants/feedback';
import { ROUTES } from '@/constants';

interface FeedbackListProps {
	feedbacks: Feedback[];
}

export function FeedbackList({ feedbacks }: FeedbackListProps) {
	if (feedbacks.length === 0) {
		return (
			<div className="text-center py-20">
				<div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
					<span className="text-2xl">💬</span>
				</div>
				<h3 className="text-base font-bold text-gray-900 mb-1">아직 피드백이 없습니다</h3>
				<p className="text-sm text-gray-500">첫 번째 피드백을 남겨주세요</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{feedbacks.map((feedback) => {
				const categoryKey = feedback.category as keyof typeof FEEDBACK_CATEGORIES;
				const categoryInfo = FEEDBACK_CATEGORIES[categoryKey] ?? FEEDBACK_CATEGORIES.OTHER;
				const statusKey = feedback.status as keyof typeof FEEDBACK_STATUSES;
				const statusInfo = FEEDBACK_STATUSES[statusKey] ?? FEEDBACK_STATUSES.PENDING;
				const hasAdminReply = (feedback.admin_reply as string)?.trim();

				return (
					<Link
						key={feedback.id as string}
						href={ROUTES.feedbackDetail(feedback.id as string)}
						className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all"
					>
						<div className="flex gap-3">
							<div className="flex-shrink-0 pt-0.5">
								<div className={`w-1.5 h-1.5 rounded-full ${hasAdminReply ? 'bg-blue-500' : 'bg-gray-400'}`} />
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between gap-2 mb-2">
									<div className="flex items-center gap-2 min-w-0">
										<span className="text-sm">{categoryInfo.EMOJI}</span>
										<h3 className="text-sm font-bold text-gray-900 truncate">{feedback.title as string}</h3>
									</div>
									<span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded ${statusInfo.CLASS_NAME}`}>
										{statusInfo.LABEL}
									</span>
								</div>

								<p className="text-xs text-gray-600 line-clamp-2 mb-2">{feedback.content as string}</p>

								{hasAdminReply && (
									<div className="bg-blue-50 rounded-md p-2 mb-2">
										<p className="text-xs text-blue-900 font-medium mb-0.5">관리자 답변</p>
										<p className="text-xs text-gray-700 line-clamp-1">{feedback.admin_reply as string}</p>
									</div>
								)}

								<div className="text-xs text-gray-500">
									{(feedback.author_name as string) || '익명'} ·{' '}
									{new Date(feedback.created_at as string).toLocaleDateString('ko-KR', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
									})}
								</div>
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
