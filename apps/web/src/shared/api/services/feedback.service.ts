import { supabase } from '@pickid/supabase';
import type { Feedback } from '@pickid/supabase';
import { handleSupabaseError } from '@/shared/lib';

type ISubmitFeedbackParams = Pick<Feedback, 'title' | 'category'> & {
	content: string;
};

export const feedbackService = {
	async submitFeedback(feedbackData: ISubmitFeedbackParams): Promise<Feedback> {
		try {
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

			if (error) throw error;
			return data;
		} catch (error) {
			handleSupabaseError(error, 'submitFeedback');
			throw error;
		}
	},

	async getFeedbacks(): Promise<Feedback[]> {
		try {
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

			if (error) throw error;
			return data || [];
		} catch (error) {
			handleSupabaseError(error, 'getFeedbacks');
			throw error;
		}
	},

	async getFeedbackById(id: string): Promise<Feedback | null> {
		try {
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

			if (error) throw error;
			return data;
		} catch (error) {
			handleSupabaseError(error, 'getFeedbackById');
			throw error;
		}
	},
};
