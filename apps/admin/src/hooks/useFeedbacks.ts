import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '@/services';
import { queryKeys } from '@/shared/lib/query-client';
import type { FeedbackFilters, FeedbackStats } from '@pickid/supabase';

export const useFeedbacks = () => {
	const queryClient = useQueryClient();
	const [filters, setFilters] = useState<FeedbackFilters>({
		search: '',
		status: 'all',
		category: 'all',
	});

	const {
		data: feedbacks = [],
		isLoading,
		error: queryError,
	} = useQuery({
		queryKey: queryKeys.feedbacks.lists(),
		queryFn: () => feedbackService.getFeedbacks(),
		staleTime: 5 * 60 * 1000,
	});

	const error = queryError ? (queryError instanceof Error ? queryError.message : '피드백을 불러오는데 실패했습니다.') : null;

	// 통계 계산 (원본 데이터 기준)
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

		// 날짜 기준값 계산은 제거 (현재 반환 타입에 불필요)

		return {
			total: feedbacks.length,
			pending: feedbacks.filter((f) => f.status === 'pending').length,
			in_progress: feedbacks.filter((f) => f.status === 'in_progress').length,
			completed: feedbacks.filter((f) => f.status === 'completed').length,
			replied: feedbacks.filter((f) => f.status === 'replied').length,
			rejected: feedbacks.filter((f) => f.status === 'rejected').length,
		};
	}, [feedbacks]);

	// 필터링된 피드백
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

	// 피드백 상태 변경
	const updateFeedbackStatusMutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: string }) =>
			feedbackService.updateFeedbackStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.lists() });
		},
	});

	// 대량 상태 변경
	const bulkUpdateStatusMutation = useMutation({
		mutationFn: ({ feedbackIds, status }: { feedbackIds: string[]; status: string }) =>
			feedbackService.bulkUpdateStatus(feedbackIds, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.lists() });
		},
	});

	// 관리자 답변 추가
	const addAdminReplyMutation = useMutation({
		mutationFn: ({ id, reply }: { id: string; reply: string }) => feedbackService.addAdminReply(id, reply),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.lists() });
		},
	});

	// 피드백 삭제
	const deleteFeedbackMutation = useMutation({
		mutationFn: (id: string) => feedbackService.deleteFeedback(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.lists() });
		},
	});

	// 필터 업데이트
	const updateFilters = useCallback((newFilters: Partial<FeedbackFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	return {
		feedbacks: filteredFeedbacks,
		loading: isLoading,
		error,
		filters,
		stats,
		updateFeedbackStatus: updateFeedbackStatusMutation.mutateAsync,
		bulkUpdateStatus: bulkUpdateStatusMutation.mutateAsync,
		addAdminReply: addAdminReplyMutation.mutateAsync,
		deleteFeedback: deleteFeedbackMutation.mutateAsync,
		updateFilters,
	};
};
