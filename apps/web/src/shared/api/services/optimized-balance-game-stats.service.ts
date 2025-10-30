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

			const { error } = await (
				client.rpc as unknown as { (fn: string, args: { choice_uuid: string }): Promise<{ error: Error | null }> }
			)('increment_choice_response_count', {
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

			interface ChoiceData {
				id: string;
				choice_text: string;
				response_count: number;
			}

			const typedChoices = choices as ChoiceData[];

			const totalResponses = typedChoices.reduce((sum, choice) => sum + (choice.response_count || 0), 0);
			const choiceStats: OptimizedChoiceStats[] = typedChoices.map((choice) => ({
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

			interface QuestionData {
				id: string;
				question_text: string;
				test_choices: Array<{
					id: string;
					choice_text: string;
					response_count: number;
					choice_order: number;
				}>;
			}

			const typedQuestions = questions as QuestionData[];

			return typedQuestions.map((question) => {
				const choices = question.test_choices || [];
				const totalResponses = choices.reduce((sum, choice) => sum + (choice.response_count || 0), 0);

				const choiceStats: OptimizedChoiceStats[] = choices.map((choice) => ({
					choiceId: choice.id,
					choiceText: choice.choice_text,
					responseCount: choice.response_count || 0,
					percentage: totalResponses > 0 ? Math.round(((choice.response_count || 0) / totalResponses) * 100) : 0,
				}));

				return {
					questionId: question.id,
					questionText: question.question_text,
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

			interface ChoiceData {
				id: string;
				choice_text: string;
				response_count: number;
			}

			return ((choices || []) as ChoiceData[]).map((choice) => ({
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
