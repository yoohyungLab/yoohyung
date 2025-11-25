import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '@/services';
import { queryKeys } from '@pickid/shared';
import { FEEDBACK_STATUS } from '@/constants';
import { useToast } from '@pickid/shared';
import type { Feedback, FeedbackFilters, FeedbackStats } from '@pickid/supabase';

export const useFeedbacks = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	const [filters, setFilters] = useState<FeedbackFilters>({
		search: '',
		status: 'all',
		category: 'all',
	});

	const { data: feedbacks = [], isLoading } = useQuery({
		queryKey: queryKeys.feedbacks.lists(),
		queryFn: () => feedbackService.getFeedbacks(),
		staleTime: 5 * 60 * 1000,
	});

	const stats = useMemo((): FeedbackStats => {
		if (feedbacks.length === 0) {
			return {
				total: 0,
				pending: 0,
				in_progress: 0,
				completed: 0,
				replied: 0,
				rejected: 0,
			};
		}

		return {
			total: feedbacks.length,
			pending: feedbacks.filter((f) => f.status === FEEDBACK_STATUS.PENDING).length,
			in_progress: feedbacks.filter((f) => f.status === FEEDBACK_STATUS.IN_PROGRESS).length,
			completed: feedbacks.filter((f) => f.status === FEEDBACK_STATUS.COMPLETED).length,
			replied: feedbacks.filter((f) => f.status === FEEDBACK_STATUS.REPLIED).length,
			rejected: feedbacks.filter((f) => f.status === FEEDBACK_STATUS.REJECTED).length,
		};
	}, [feedbacks]);

	const filteredFeedbacks = useMemo(() => {
		return feedbacks.filter((feedback) => {
			const matchesSearch =
				!filters.search ||
				feedback.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
				feedback.content?.toLowerCase().includes(filters.search.toLowerCase()) ||
				feedback.author_name?.toLowerCase().includes(filters.search.toLowerCase());

			const matchesStatus = filters.status === 'all' || feedback.status === filters.status;
			const matchesCategory = filters.category === 'all' || feedback.category === filters.category;

			return matchesSearch && matchesStatus && matchesCategory;
		});
	}, [feedbacks, filters]);

	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: Feedback['status'] }) =>
			feedbackService.updateFeedbackStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.lists() });
			toast.success('피드백 상태가 변경되었습니다.');
		},
	});

	const bulkUpdateStatusMutation = useMutation({
		mutationFn: ({ feedbackIds, status }: { feedbackIds: string[]; status: Feedback['status'] }) =>
			feedbackService.bulkUpdateStatus(feedbackIds, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.lists() });
			toast.success('대량 상태 변경이 완료되었습니다.');
		},
	});

	const addReplyMutation = useMutation({
		mutationFn: ({ id, reply }: { id: string; reply: string }) => feedbackService.addAdminReply(id, reply),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.lists() });
			toast.success('관리자 답변이 추가되었습니다.');
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => feedbackService.deleteFeedback(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.lists() });
			toast.success('피드백이 삭제되었습니다.');
		},
	});

	const updateFilters = useCallback((newFilters: Partial<FeedbackFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	return {
		feedbacks: filteredFeedbacks,
		loading: isLoading,
		filters,
		stats,
		updateFilters,
		updateStatus: updateStatusMutation.mutateAsync,
		bulkUpdateStatus: bulkUpdateStatusMutation.mutateAsync,
		addReply: addReplyMutation.mutateAsync,
		deleteFeedback: deleteMutation.mutateAsync,
	};
};
