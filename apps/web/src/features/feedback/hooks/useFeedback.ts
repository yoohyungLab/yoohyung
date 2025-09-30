import { useState, useCallback } from 'react';
import { supabase } from '@repo/shared';

export function useFeedback() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 피드백 제출
	const submitFeedback = useCallback(
		async (feedbackData: {
			title: string;
			content: string;
			category: string;
			author_name?: string;
			author_email?: string;
			attached_file_url?: string;
		}) => {
			try {
				setIsLoading(true);
				setError(null);

				const { data, error } = await supabase
					.from('feedbacks')
					.insert([
						{
							...feedbackData,
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
		},
		[]
	);

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


