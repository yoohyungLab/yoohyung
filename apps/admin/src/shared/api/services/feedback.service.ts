import { supabase } from '@pickid/supabase';
import type { Feedback, FeedbackStats, AdminFeedbackResponse } from '@pickid/supabase';

export type { AdminFeedbackResponse, FeedbackStats };

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

export const feedbackService = {
	async getFeedbacks(): Promise<Feedback[]> {
		try {
			const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });

			if (error) throw error;
			return data || [];
		} catch (error) {
			handleSupabaseError(error, 'getFeedbacks');
			throw error;
		}
	},

	async updateFeedbackStatus(id: string, status: string): Promise<Feedback> {
		try {
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
		} catch (error) {
			handleSupabaseError(error, 'updateFeedbackStatus');
			throw error;
		}
	},

	async addAdminReply(id: string, reply: string): Promise<Feedback> {
		try {
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
		} catch (error) {
			handleSupabaseError(error, 'addAdminReply');
			throw error;
		}
	},

	async deleteFeedback(id: string): Promise<void> {
		try {
			const { error } = await supabase.from('feedbacks').delete().eq('id', id);
			if (error) throw error;
		} catch (error) {
			handleSupabaseError(error, 'deleteFeedback');
			throw error;
		}
	},

	async bulkUpdateStatus(feedbackIds: string[], status: string): Promise<number> {
		try {
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
		} catch (error) {
			handleSupabaseError(error, 'bulkUpdateStatus');
			throw error;
		}
	},

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
			handleSupabaseError(error, 'getFeedbackStats');
			throw error;
		}
	},
};
