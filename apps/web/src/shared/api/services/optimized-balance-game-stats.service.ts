import { createServerClient, supabase } from '@pickid/supabase';
import type { OptimizedChoiceStats, OptimizedQuestionStats } from '@pickid/supabase';

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

export const optimizedBalanceGameStatsService = {
	getClient() {
		return typeof window === 'undefined' ? createServerClient() : supabase;
	},

	async incrementChoiceCount(choiceId: string): Promise<void> {
		try {
			const client = this.getClient();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const { error } = await (client.rpc as any)('increment_choice_response_count', {
				choice_uuid: choiceId,
			});

			if (error) throw error;
		} catch (error) {
			handleSupabaseError(error, 'incrementChoiceCount');
		}
	},

	async getQuestionStats(questionId: string): Promise<OptimizedQuestionStats | null> {
		try {
			const client = this.getClient();
			const { data: choices, error } = await client
				.from('test_choices')
				.select('id, choice_text, response_count')
				.eq('question_id', questionId)
				.order('choice_order');

			if (error) throw error;

			if (!choices || choices.length === 0) {
				return {
					questionId,
					questionText: '',
					choiceStats: [],
					totalResponses: 0,
				};
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const totalResponses = (choices as any[]).reduce(
				(sum: number, choice: any) => sum + (choice.response_count || 0),
				0
			);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const choiceStats: OptimizedChoiceStats[] = (choices as any[]).map((choice: any) => ({
				choiceId: choice.id,
				choiceText: choice.choice_text,
				responseCount: choice.response_count || 0,
				percentage: totalResponses > 0 ? Math.round(((choice.response_count || 0) / totalResponses) * 100) : 0,
			}));

			return {
				questionId,
				questionText: '',
				choiceStats,
				totalResponses,
			};
		} catch (error) {
			handleSupabaseError(error, 'getQuestionStats');
			return null;
		}
	},

	async getAllQuestionStats(testId: string): Promise<OptimizedQuestionStats[]> {
		try {
			const client = this.getClient();
			const { data: questions, error } = await client
				.from('test_questions')
				.select(
					`
					id,
					question_text,
					test_choices!inner(
						id,
						choice_text,
						response_count,
						choice_order
					)
				`
				)
				.eq('test_id', testId)
				.order('question_order');

			if (error) throw error;
			if (!questions || questions.length === 0) return [];

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (questions as any[]).map((question: any) => {
				const choices = question.test_choices || [];
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const totalResponses = (choices as any[]).reduce(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(sum: number, choice: any) => sum + (choice.response_count || 0),
					0
				);

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const choiceStats: OptimizedChoiceStats[] = (choices as any[]).map(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(choice: any) => ({
						choiceId: choice.id,
						choiceText: choice.choice_text,
						responseCount: choice.response_count || 0,
						percentage: totalResponses > 0 ? Math.round(((choice.response_count || 0) / totalResponses) * 100) : 0,
					})
				);

				return {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					questionId: (question as any).id,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					questionText: (question as any).question_text,
					choiceStats,
					totalResponses,
				};
			});
		} catch (error) {
			handleSupabaseError(error, 'getAllQuestionStats');
			return [];
		}
	},

	async getPopularChoices(testId: string, limit: number = 5): Promise<OptimizedChoiceStats[]> {
		try {
			const client = this.getClient();
			const { data: choices, error } = await client
				.from('test_choices')
				.select(
					`
					id,
					choice_text,
					response_count,
					test_questions!inner(test_id)
				`
				)
				.eq('test_questions.test_id', testId)
				.order('response_count', { ascending: false })
				.limit(limit);

			if (error) throw error;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return ((choices || []) as any[]).map((choice: any) => ({
				choiceId: choice.id,
				choiceText: choice.choice_text,
				responseCount: choice.response_count || 0,
				percentage: 0,
			}));
		} catch (error) {
			handleSupabaseError(error, 'getPopularChoices');
			return [];
		}
	},
};
