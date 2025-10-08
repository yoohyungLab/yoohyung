import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@pickid/shared';
import type { Feedback } from '@pickid/supabase';

// 피드백 제출용 훅
export function useFeedback() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const submitFeedback = useCallback(async (feedbackData: { title: string; content: string; category: string }) => {
		try {
			setIsLoading(true);
			setError(null);

			// 현재 사용자 정보 가져오기
			const {
				data: { user },
			} = await supabase.auth.getUser();

			const { data, error } = await supabase
				.from('feedbacks')
				.insert([
					{
						...feedbackData,
						author_name: user?.user_metadata?.name || user?.email?.split('@')[0] || '익명',
						author_email: user?.email,
						status: 'pending',
						created_at: new Date().toISOString(),
					},
				])
				.select()
				.single();

			if (error) throw error;
			return data;
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

// 피드백 목록용 훅
export function useFeedbackList() {
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 피드백 목록 로드
	const loadFeedbacks = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });

			if (error) throw error;
			setFeedbacks(data || []);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '피드백을 불러오는데 실패했습니다.';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// 초기 로드
	useEffect(() => {
		loadFeedbacks();
	}, [loadFeedbacks]);

	return {
		feedbacks,
		isLoading,
		error,
		refresh: loadFeedbacks,
	};
}

// 개별 피드백 조회용 훅
export function useFeedbackDetail(id: string) {
	const [feedback, setFeedback] = useState<Feedback | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadFeedback = useCallback(async () => {
		if (!id) return;

		try {
			setIsLoading(true);
			setError(null);

			const { data, error } = await supabase.from('feedbacks').select('*').eq('id', id).single();

			if (error) throw error;
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
