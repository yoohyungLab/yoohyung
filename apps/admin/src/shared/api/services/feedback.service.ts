import { supabase } from '@pickid/shared';
import type { Feedback, FeedbackStats, AdminFeedbackResponse } from '@pickid/supabase';

// Re-export types for convenience
export type { AdminFeedbackResponse, FeedbackStats };

// 피드백 서비스 - 실제 사용되는 함수들만 포함
export const feedbackService = {
	// 피드백 목록 조회
	async getFeedbacks(): Promise<Feedback[]> {
		const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });

		if (error) throw error;
		return data || [];
	},

	// 피드백 상태 업데이트
	async updateFeedbackStatus(id: string, status: string) {
		const { data, error } = await supabase
			.from('feedbacks')
			.update({
				status,
				updated_at: new Date().toISOString(),
			})
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	// 관리자 답변 추가
	async addAdminReply(id: string, reply: string) {
		const { data, error } = await supabase
			.from('feedbacks')
			.update({
				admin_reply: reply,
				admin_reply_at: new Date().toISOString(),
				status: 'replied',
				updated_at: new Date().toISOString(),
			})
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	// 피드백 삭제
	async deleteFeedback(id: string) {
		const { error } = await supabase.from('feedbacks').delete().eq('id', id);
		if (error) throw error;
	},

	// 여러 피드백 상태 일괄 업데이트
	async bulkUpdateStatus(feedbackIds: string[], status: string): Promise<number> {
		const { data, error } = await supabase
			.from('feedbacks')
			.update({
				status,
				updated_at: new Date().toISOString(),
			})
			.in('id', feedbackIds)
			.select();

		if (error) throw error;
		return data?.length || 0;
	},

	// 피드백 통계 조회 (상태별, 기간별)
	async getFeedbackStats() {
		try {
			const { data, error } = await supabase.from('feedbacks').select('status, created_at');
			if (error) throw error;

			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
			const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

			const feedbacks = (data as Feedback[]) || [];

			return {
				total: feedbacks.length,
				pending: feedbacks.filter((f: Feedback) => f.status === 'pending').length,
				in_progress: feedbacks.filter((f: Feedback) => f.status === 'in_progress').length,
				completed: feedbacks.filter((f: Feedback) => f.status === 'completed').length,
				replied: feedbacks.filter((f: Feedback) => f.status === 'replied').length,
				rejected: feedbacks.filter((f: Feedback) => f.status === 'rejected').length,
				today: feedbacks.filter((f: Feedback) => new Date(f.created_at) >= today).length,
				thisWeek: feedbacks.filter((f: Feedback) => new Date(f.created_at) >= thisWeek).length,
				thisMonth: feedbacks.filter((f: Feedback) => new Date(f.created_at) >= thisMonth).length,
			};
		} catch (error) {
			console.error('통계 조회 중 에러 발생:', error);
			return {
				total: 0,
				pending: 0,
				in_progress: 0,
				completed: 0,
				replied: 0,
				rejected: 0,
				today: 0,
				thisWeek: 0,
				thisMonth: 0,
			};
		}
	},
};
