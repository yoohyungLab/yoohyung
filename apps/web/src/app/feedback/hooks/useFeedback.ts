import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '@/api/services/feedback.service';
import { queryKeys } from '@pickid/shared';

interface ISubmitFeedbackData {
	title: string;
	content: string;
	category: string;
}

// 피드백 목록 조회
export function useFeedbackList() {
	return useQuery({
		queryKey: queryKeys.feedbacks.lists(),
		queryFn: () => feedbackService.getFeedbacks(),
		staleTime: 5 * 60 * 1000,
	});
}

// 피드백 상세 조회
export function useFeedbackDetail(id: string) {
	return useQuery({
		queryKey: queryKeys.feedbacks.detail(id),
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
			queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.lists() });
		},
	});
}
