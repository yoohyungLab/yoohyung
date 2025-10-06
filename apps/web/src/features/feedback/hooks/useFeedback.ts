import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@repo/shared';
import type { Feedback } from '@repo/supabase';

interface UseFeedbackListOptions {
	limit?: number;
	initialLoad?: boolean;
}

export function useFeedback() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 피드백 제출
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

	// 피드백 조회
	const getFeedback = useCallback(async (id: string) => {
		try {
			setIsLoading(true);
			setError(null);

			const { data, error } = await supabase.from('feedbacks').select('*').eq('id', id).single();

			if (error) throw error;
			return data;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '피드백을 불러오는데 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		isLoading,
		error,
		submitFeedback,
		getFeedback,
	};
}

export function useFeedbackList({ limit = 10, initialLoad = true }: UseFeedbackListOptions = {}) {
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const [offset, setOffset] = useState(0);

	const loadFeedbacks = useCallback(
		async (reset = false) => {
			try {
				setIsLoading(true);
				setError(null);

				const currentOffset = reset ? 0 : offset;

				const { data, error: fetchError } = await supabase
					.from('feedbacks')
					.select('*')
					.order('created_at', { ascending: false })
					.range(currentOffset, currentOffset + limit - 1);

				if (fetchError) throw fetchError;

				const newFeedbacks = data || [];

				if (reset) {
					setFeedbacks(newFeedbacks);
					setOffset(limit);
				} else {
					setFeedbacks((prev) => [...prev, ...newFeedbacks]);
					setOffset((prev) => prev + limit);
				}

				setHasMore(newFeedbacks.length === limit);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '피드백을 불러오는데 실패했습니다.';
				setError(errorMessage);
			} finally {
				setIsLoading(false);
			}
		},
		[limit, offset]
	);

	const loadMore = useCallback(() => {
		if (!isLoading && hasMore) {
			loadFeedbacks(false);
		}
	}, [isLoading, hasMore, loadFeedbacks]);

	const refresh = useCallback(() => {
		loadFeedbacks(true);
	}, [loadFeedbacks]);

	useEffect(() => {
		if (initialLoad) {
			loadFeedbacks(true);
		}
	}, [initialLoad, loadFeedbacks]);

	return {
		feedbacks,
		isLoading,
		error,
		hasMore,
		loadMore,
		refresh,
	};
}
