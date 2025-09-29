import { useState, useCallback, useEffect, useMemo } from 'react';
import { feedbackService } from '@/shared/api';
import type { Feedback, FeedbackFilters, FeedbackStats } from '@repo/supabase';

export const useFeedbacks = () => {
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<FeedbackFilters>({
		search: '',
		status: 'all',
		category: 'all',
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
				today: 0,
				this_week: 0,
				this_month: 0,
			};
		}

		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
		const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		return {
			total: feedbacks.length,
			pending: feedbacks.filter((f) => f.status === 'pending').length,
			in_progress: feedbacks.filter((f) => f.status === 'in_progress').length,
			completed: feedbacks.filter((f) => f.status === 'completed').length,
			replied: feedbacks.filter((f) => f.status === 'replied').length,
			rejected: feedbacks.filter((f) => f.status === 'rejected').length,
			today: feedbacks.filter((f) => new Date(f.created_at) >= today).length,
			this_week: feedbacks.filter((f) => new Date(f.created_at) >= thisWeek).length,
			this_month: feedbacks.filter((f) => new Date(f.created_at) >= thisMonth).length,
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

	// 데이터 로딩
	const loadFeedbacks = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await feedbackService.getFeedbacks();
			setFeedbacks(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : '피드백을 불러오는데 실패했습니다.');
		} finally {
			setLoading(false);
		}
	}, []);

	// 피드백 상태 변경
	const updateFeedbackStatus = useCallback(async (id: string, status: string) => {
		try {
			const updatedFeedback = await feedbackService.updateFeedbackStatus(id, status);
			setFeedbacks((prev) => prev.map((f) => (f.id === id ? updatedFeedback : f)));
		} catch (err) {
			setError(err instanceof Error ? err.message : '피드백 상태 변경에 실패했습니다.');
		}
	}, []);

	// 대량 상태 변경
	const bulkUpdateStatus = useCallback(
		async (feedbackIds: string[], status: string) => {
			try {
				await feedbackService.bulkUpdateStatus(feedbackIds, status);
				// 상태 업데이트 후 전체 데이터 다시 로드
				await loadFeedbacks();
			} catch (err) {
				setError(err instanceof Error ? err.message : '피드백 일괄 상태 변경에 실패했습니다.');
			}
		},
		[loadFeedbacks]
	);

	// 관리자 답변 추가
	const addAdminReply = useCallback(async (id: string, reply: string) => {
		try {
			const updatedFeedback = await feedbackService.addAdminReply(id, reply);
			setFeedbacks((prev) => prev.map((f) => (f.id === id ? updatedFeedback : f)));
		} catch (err) {
			setError(err instanceof Error ? err.message : '답변 추가에 실패했습니다.');
			throw err;
		}
	}, []);

	// 피드백 삭제
	const deleteFeedback = useCallback(async (id: string) => {
		try {
			await feedbackService.deleteFeedback(id);
			setFeedbacks((prev) => prev.filter((f) => f.id !== id));
		} catch (err) {
			setError(err instanceof Error ? err.message : '피드백 삭제에 실패했습니다.');
		}
	}, []);

	// 필터 업데이트
	const updateFilters = useCallback((newFilters: Partial<FeedbackFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	// 초기 로딩
	useEffect(() => {
		loadFeedbacks();
	}, [loadFeedbacks]);

	return {
		feedbacks: filteredFeedbacks,
		loading,
		error,
		filters,
		stats,
		loadFeedbacks,
		updateFeedbackStatus,
		bulkUpdateStatus,
		addAdminReply,
		deleteFeedback,
		updateFilters,
	};
};
