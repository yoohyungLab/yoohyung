'use client';

import Link from 'next/link';
import { Feedback } from '@repo/supabase';
import { Button } from '@repo/ui';
import { getCategoryInfo, getStatusInfo, formatDate, getStatusClassName } from '../utils';

interface FeedbackListProps {
	feedbacks: Feedback[];
	onLoadMore?: () => void;
	hasMore?: boolean;
	isLoading?: boolean;
}

export function FeedbackList({ feedbacks, onLoadMore, hasMore, isLoading }: FeedbackListProps) {
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
				const categoryInfo = getCategoryInfo(feedback.category);
				const statusInfo = getStatusInfo(feedback.status);
				const hasAdminReply = feedback.admin_reply?.trim();

				return (
					<Link
						key={feedback.id}
						href={`/feedback/${feedback.id}`}
						className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all"
					>
						<div className="flex gap-3">
							<div className="flex-shrink-0 pt-0.5">
								<div className={`w-1.5 h-1.5 rounded-full ${hasAdminReply ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between gap-2 mb-2">
									<div className="flex items-center gap-2 min-w-0">
										<span className="text-sm">{categoryInfo.emoji}</span>
										<h3 className="text-sm font-bold text-gray-900 truncate">{feedback.title}</h3>
									</div>
									<span
										className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded ${getStatusClassName(
											statusInfo.color
										)}`}
									>
										{statusInfo.label}
									</span>
								</div>

								<p className="text-xs text-gray-600 line-clamp-2 mb-2">{feedback.content}</p>

								{hasAdminReply && (
									<div className="bg-blue-50 rounded-md p-2 mb-2">
										<p className="text-xs text-blue-900 font-medium mb-0.5">관리자 답변</p>
										<p className="text-xs text-gray-700 line-clamp-1">{feedback.admin_reply}</p>
									</div>
								)}

								<div className="text-xs text-gray-500">
									{feedback.author_name || '익명'} · {formatDate(feedback.created_at)}
								</div>
							</div>
						</div>
					</Link>
				);
			})}

			{hasMore && onLoadMore && (
				<div className="pt-4 text-center">
					<Button onClick={onLoadMore} loading={isLoading} variant="outline" className="px-6 text-sm">
						더보기
					</Button>
				</div>
			)}
		</div>
	);
}
