import { supabase } from '@pickid/supabase';
import type { Feedback } from '@pickid/supabase';

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

type ISubmitFeedbackParams = Pick<Feedback, 'title' | 'category'> & {
	content: string;
};

export const feedbackService = {
	async submitFeedback(feedbackData: ISubmitFeedbackParams): Promise<Feedback> {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const { data, error } = await (supabase.from as any)('feedbacks')
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
		} catch (error) {
			handleSupabaseError(error, 'submitFeedback');
			throw error;
		}
	},

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

	async getFeedbackById(id: string): Promise<Feedback | null> {
		try {
			const { data, error } = await supabase.from('feedbacks').select('*').eq('id', id).single();

			if (error) throw error;
			return data;
		} catch (error) {
			handleSupabaseError(error, 'getFeedbackById');
			throw error;
		}
	},
};
