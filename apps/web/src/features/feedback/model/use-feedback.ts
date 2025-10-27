import { useCallback, useEffect, useState } from 'react';

import { feedbackService } from '@/shared/api/services/feedback.service';
import type { Feedback } from '@pickid/supabase';

interface ISubmitFeedbackData {
	title: string;
	content: string;
	category: string;
}

export function useFeedback() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const submitFeedback = useCallback(async (feedbackData: ISubmitFeedbackData) => {
		try {
			setIsLoading(true);
			setError(null);
			return await feedbackService.submitFeedback(feedbackData);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '피드백 제출에 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return { isLoading, error, submitFeedback };
}

export function useFeedbackList() {
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadFeedbacks = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await feedbackService.getFeedbacks();
			setFeedbacks(data);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '피드백을 불러오는데 실패했습니다.';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadFeedbacks();
	}, [loadFeedbacks]);

	return { feedbacks, isLoading, error, refresh: loadFeedbacks };
}

export function useFeedbackDetail(id: string) {
	const [feedback, setFeedback] = useState<Feedback | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadFeedback = useCallback(async () => {
		if (!id) return;

		try {
			setIsLoading(true);
			setError(null);
			const data = await feedbackService.getFeedbackById(id);
			setFeedback(data);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '피드백을 불러오는데 실패했습니다.';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		loadFeedback();
	}, [loadFeedback]);

	return { feedback, isLoading, error, refresh: loadFeedback };
}
