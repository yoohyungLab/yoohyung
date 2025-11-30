import { supabase } from '@pickid/supabase';
import type { Feedback, FeedbackInsert } from '@pickid/supabase';

export const feedbackService = {
	async submitFeedback(feedbackData: Pick<FeedbackInsert, 'title' | 'category' | 'content'>): Promise<Feedback> {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session || !session.user?.email) {
			throw new Error('로그인이 필요합니다.');
		}

		const { data, error } = await supabase
			.from('feedbacks')
			.insert([
				{
					...feedbackData,
					author_name:
						(session.user.user_metadata as { name?: string } | null)?.name ||
						session.user.email.split('@')[0] ||
						'user',
					author_email: session.user.email,
					status: 'pending',
					created_at: new Date().toISOString(),
				},
			])
			.select()
			.single();

		if (error) {
			throw new Error(`피드백 제출 실패: ${error.message}`);
		}

		return data;
	},

	async getFeedbacks(): Promise<Feedback[]> {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session || !session.user?.email) {
			throw new Error('로그인이 필요합니다.');
		}

		const { data, error } = await supabase
			.from('feedbacks')
			.select('*')
			.eq('author_email', session.user.email)
			.order('created_at', { ascending: false });

		if (error) {
			throw new Error(`피드백 목록 조회 실패: ${error.message}`);
		}

		return data || [];
	},

	async getFeedbackById(id: string): Promise<Feedback | null> {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session || !session.user?.email) {
			throw new Error('로그인이 필요합니다.');
		}

		const { data, error } = await supabase
			.from('feedbacks')
			.select('*')
			.eq('id', id)
			.eq('author_email', session.user.email)
			.single();

		if (error) {
			throw new Error(`피드백 조회 실패: ${error.message}`);
		}

		return data;
	},
};
