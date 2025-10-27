import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '@/shared/api';
import { queryKeys } from '@/shared/lib/query-client';
import type { Feedback, FeedbackFilters, FeedbackStats } from '@pickid/supabase';

export const useFeedbacks = () => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<FeedbackFilters>({
		search: '',
		status: 'all',
		category: 'all',
	});

	const {
		data: feedbacks = [],
		isLoading,
		refetch,
	} = useQuery({
		queryKey: queryKeys.feedbacks.lists(),
		queryFn: () => feedbackService.getFeedbacks(),
		staleTime: 5 * 60 * 1000,
	});

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

	const loadFeedbacks = useCallback(async () => {
		setError(null);
		await refetch();
	}, [refetch]);

	// 피드백 상태 변경
	const { mutateAsync: updateFeedbackStatus } = useMutation({
		mutationFn: async ({ id, status }: { id: string; status: string }) =>
			feedbackService.updateFeedbackStatus(id, status),
		onMutate: async ({ id, status }) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.feedbacks.lists() });
			const previous = queryClient.getQueryData<Feedback[]>(queryKeys.feedbacks.lists());
			queryClient.setQueryData<Feedback[]>(queryKeys.feedbacks.lists(), (prev = []) =>
				prev.map((f) => (f.id === id ? { ...f, status, updated_at: new Date().toISOString() } : f))
			);
			return { previous } as { previous?: Feedback[] };
		},
		onError: (_err, _vars, context) => {
			if (context?.previous) queryClient.setQueryData(queryKeys.feedbacks.lists(), context.previous);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.lists() }),
	});

	// 대량 상태 변경
	const { mutateAsync: bulkUpdateStatus } = useMutation({
		mutationFn: async ({ feedbackIds, status }: { feedbackIds: string[]; status: string }) =>
			feedbackService.bulkUpdateStatus(feedbackIds, status),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.lists() }),
		onError: (err: unknown) => setError(err instanceof Error ? err.message : '피드백 일괄 상태 변경에 실패했습니다.'),
	});

	// 관리자 답변 추가
	const { mutateAsync: addAdminReply } = useMutation({
		mutationFn: async ({ id, reply }: { id: string; reply: string }) => feedbackService.addAdminReply(id, reply),
		onSuccess: (updated) => {
			queryClient.setQueryData<Feedback[]>(queryKeys.feedbacks.lists(), (prev = []) =>
				prev.map((f) => (f.id === updated.id ? updated : f))
			);
		},
		onError: (err: unknown) => setError(err instanceof Error ? err.message : '답변 추가에 실패했습니다.'),
	});

	// 피드백 삭제
	const { mutateAsync: deleteFeedback } = useMutation({
		mutationFn: async (id: string) => feedbackService.deleteFeedback(id),
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.feedbacks.lists() });
			const previous = queryClient.getQueryData<Feedback[]>(queryKeys.feedbacks.lists());
			queryClient.setQueryData<Feedback[]>(queryKeys.feedbacks.lists(), (prev = []) => prev.filter((f) => f.id !== id));
			return { previous } as { previous?: Feedback[] };
		},
		onError: (_err, _id, context) => {
			if (context?.previous) queryClient.setQueryData(queryKeys.feedbacks.lists(), context.previous);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.lists() }),
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
		loadFeedbacks,
		updateFeedbackStatus: (id: string, status: string) => updateFeedbackStatus({ id, status }),
		bulkUpdateStatus: (feedbackIds: string[], status: string) => bulkUpdateStatus({ feedbackIds, status }),
		addAdminReply: (id: string, reply: string) => addAdminReply({ id, reply }),
		deleteFeedback,
		updateFilters,
	} as const;
};
