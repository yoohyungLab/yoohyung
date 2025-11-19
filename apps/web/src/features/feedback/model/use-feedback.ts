import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '@/shared/api/services/feedback.service';
import type { Feedback } from '@pickid/supabase';

interface ISubmitFeedbackData {
	title: string;
	content: string;
	category: string;
}

// Query Keys
const feedbackKeys = {
	all: ['feedbacks'] as const,
	detail: (id: string) => ['feedback', id] as const,
};

// 피드백 목록 조회
export function useFeedbackList() {
	return useQuery({
		queryKey: feedbackKeys.all,
		queryFn: () => feedbackService.getFeedbacks(),
		staleTime: 5 * 60 * 1000,
	});
}

// 피드백 상세 조회
export function useFeedbackDetail(id: string) {
	return useQuery({
		queryKey: feedbackKeys.detail(id),
		queryFn: () => feedbackService.getFeedbackById(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
	});
}

// 피드백 제출
export function useFeedbackSubmit() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ISubmitFeedbackData) => feedbackService.submitFeedback(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
		},
	});
}
