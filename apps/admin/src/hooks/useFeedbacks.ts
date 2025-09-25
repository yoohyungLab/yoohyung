import { useState, useCallback } from 'react';
import { feedbackService } from '../shared/api/services/feedback.service';
import type { Feedback, FeedbackFilters } from '../shared/api/services/feedback.service';

export const useFeedbacks = () => {
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [total, setTotal] = useState(0);

	const fetchFeedbacks = useCallback(async (filters?: FeedbackFilters) => {
		try {
			setLoading(true);
			setError(null);
			const response = await feedbackService.getFeedbacks(filters);
			setFeedbacks(response.feedbacks);
			setTotal(response.total);
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '피드백을 불러오는데 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateFeedbackStatus = useCallback(async (id: string, status: Feedback['status']) => {
		try {
			setLoading(true);
			setError(null);
			const updatedFeedback = await feedbackService.updateFeedbackStatus(id, status);
			setFeedbacks((prev) => prev.map((feedback) => (feedback.id === id ? updatedFeedback : feedback)));
			return updatedFeedback;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '피드백 상태 수정에 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const replyToFeedback = useCallback(async (id: string, reply: string) => {
		try {
			setLoading(true);
			setError(null);
			const updatedFeedback = await feedbackService.addAdminReply(id, reply);
			setFeedbacks((prev) => prev.map((feedback) => (feedback.id === id ? updatedFeedback : feedback)));
			return updatedFeedback;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '피드백 답변에 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const bulkUpdateStatus = useCallback(async (ids: string[], status: Feedback['status']) => {
		try {
			setLoading(true);
			setError(null);
			await feedbackService.bulkUpdateStatus(ids, status);
			setFeedbacks((prev) => prev.map((feedback) => (ids.includes(feedback.id) ? { ...feedback, status } : feedback)));
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '피드백 일괄 수정에 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const deleteFeedback = useCallback(async (id: string) => {
		try {
			setLoading(true);
			setError(null);
			await feedbackService.deleteFeedback(id);
			setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== id));
			setTotal((prev) => prev - 1);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '피드백 삭제에 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const getFeedbackStats = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const stats = await feedbackService.getFeedbackStats();
			return stats;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '피드백 통계를 불러오는데 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const clearError = useCallback(() => setError(null), []);

	return {
		feedbacks,
		loading,
		error,
		total,
		fetchFeedbacks,
		updateFeedbackStatus,
		replyToFeedback,
		bulkUpdateStatus,
		deleteFeedback,
		getFeedbackStats,
		clearError,
	};
};
