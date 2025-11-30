import type { Feedback } from '@pickid/supabase';
import { supabase } from '@pickid/supabase';

export const feedbackService = {
	async getFeedbacks(): Promise<Feedback[]> {
		const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });

		if (error) {
			throw new Error(`피드백 목록 조회 실패: ${error.message}`);
		}

		return data || [];
	},

	async updateFeedbackStatus(id: string, status: string): Promise<Feedback> {
		const { data, error } = await supabase
			.from('feedbacks')
			.update({
				status,
				updated_at: new Date().toISOString(),
			})
			.eq('id', id)
			.select()
			.single();

		if (error) {
			throw new Error(`피드백 상태 변경 실패: ${error.message}`);
		}

		return data;
	},

	async addAdminReply(id: string, reply: string): Promise<Feedback> {
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

		if (error) {
			throw new Error(`관리자 답변 추가 실패: ${error.message}`);
		}

		return data;
	},

	async deleteFeedback(id: string): Promise<void> {
		const { error } = await supabase.from('feedbacks').delete().eq('id', id);

		if (error) {
			throw new Error(`피드백 삭제 실패: ${error.message}`);
		}
	},

	async bulkUpdateStatus(feedbackIds: string[], status: string): Promise<number> {
		const { data, error } = await supabase
			.from('feedbacks')
			.update({
				status,
				updated_at: new Date().toISOString(),
			})
			.in('id', feedbackIds)
			.select();

		if (error) {
			throw new Error(`대량 상태 변경 실패: ${error.message}`);
		}

		return data?.length || 0;
	},

	async getFeedbackStats() {
		const { data: feedbacks, error } = await supabase.from('feedbacks').select('status, created_at');

		if (error) {
			throw new Error(`피드백 통계 조회 실패: ${error.message}`);
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
			thisWeek: feedbacks.filter((f) => new Date(f.created_at) >= thisWeek).length,
			thisMonth: feedbacks.filter((f) => new Date(f.created_at) >= thisMonth).length,
		};
	},
};
