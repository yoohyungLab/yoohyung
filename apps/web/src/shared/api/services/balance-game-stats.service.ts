import { createServerClient, supabase } from '@pickid/supabase';
import type { QuestionStats, PopularQuestion, BalanceGameStats } from '@pickid/supabase';

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

export const balanceGameStatsService = {
	getClient() {
		return typeof window === 'undefined' ? createServerClient() : supabase;
	},
	async getQuestionStats(testId: string, questionId: string): Promise<QuestionStats | null> {
		try {
			const client = this.getClient();
			const { data: responses, error } = await client
				.from('user_test_responses')
				.select('responses')
				.eq('test_id', testId)
				.not('responses', 'is', null);

			if (error) throw error;
			if (!responses || responses.length === 0) return null;

			const { data: question, error: questionError } = await client
				.from('test_questions')
				.select('id, question_text')
				.eq('id', questionId)
				.single();

			if (questionError) throw questionError;

			const questionData= question ;

			const choiceCounts = new Map<string, number>();
			let totalResponses = 0;

			responses.forEach((response: { responses: unknown }) => {
				if (response.responses && Array.isArray(response.responses)) {
					(response.responses as Array<{ questionId: string; choiceId: string }>).forEach((answer) => {
						if (answer.questionId === questionId) {
							const choiceId = answer.choiceId;
							choiceCounts.set(choiceId, (choiceCounts.get(choiceId) || 0) + 1);
							totalResponses++;
						}
					});
				}
			});

			// 선택지 정보 조회
			const { data: choices, error: choicesError } = await client
				.from('test_choices')
				.select('id, choice_text')
				.eq('question_id', questionId)
				.order('choice_order');

			if (choicesError) throw choicesError;

			const choiceStats =
				choices?.map((choice: { id: string; choice_text: string }) => {
					const count = choiceCounts.get(choice.id) || 0;
					const percentage = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;

					return {
						choiceId: choice.id,
						choiceText: choice.choice_text,
						count,
						percentage,
					};
				}) || [];

			return {
				questionId,
				questionText: questionData.question_text,
				choiceStats,
				totalResponses,
			};
		} catch (error) {
			handleSupabaseError(error, 'getQuestionStats');
			return null;
		}
	},

	async getAllQuestionStats(testId: string): Promise<QuestionStats[]> {
		try {
			const client = this.getClient();
			const { data: questions, error: questionsError } = await client
				.from('test_questions')
				.select('id, question_text')
				.eq('test_id', testId)
				.order('question_order');

			if (questionsError) throw questionsError;
			if (!questions || questions.length === 0) return [];

			const questionStatsPromises = questions.map(async (question: { id: string; question_text: string }) => {
				const stats = await this.getQuestionStats(testId, question.id);
				return stats;
			});

			const questionStats = await Promise.all(questionStatsPromises);
			return questionStats.filter((stats): stats is QuestionStats => stats !== null);
		} catch (error) {
			handleSupabaseError(error, 'getAllQuestionStats');
			return [];
		}
	},

	async getPopularQuestions(testId: string, limit: number = 3): Promise<PopularQuestion[]> {
		try {
			const allStats = await this.getAllQuestionStats(testId);

			const controversialQuestions = allStats
				.filter((stats) => stats.choiceStats.length === 2)
				.map((stats) => {
					const [choiceA, choiceB] = stats.choiceStats;
					const aPercentage = choiceA.percentage;
					const bPercentage = choiceB.percentage;
					const controversyScore = Math.abs(50 - aPercentage);

					return {
						questionId: stats.questionId,
						questionText: stats.questionText,
						aChoiceText: choiceA.choiceText,
						bChoiceText: choiceB.choiceText,
						aPercentage,
						bPercentage,
						totalResponses: stats.totalResponses,
						controversyScore,
					};
				})
				.sort((a, b) => a.controversyScore - b.controversyScore)
				.slice(0, limit);

			return controversialQuestions;
		} catch (error) {
			handleSupabaseError(error, 'getPopularQuestions');
			return [];
		}
	},

	async getMostControversialQuestion(testId: string): Promise<PopularQuestion | null> {
		try {
			const popularQuestions = await this.getPopularQuestions(testId, 1);
			return popularQuestions[0] || null;
		} catch (error) {
			handleSupabaseError(error, 'getMostControversialQuestion');
			return null;
		}
	},

	async getTestStats(testId: string): Promise<BalanceGameStats> {
		try {
			const client = this.getClient();
			const { count: totalParticipants, error: countError } = await client
				.from('user_test_responses')
				.select('*', { count: 'exact', head: true })
				.eq('test_id', testId);

			if (countError) throw countError;

			const questionStats = await this.getAllQuestionStats(testId);
			const popularQuestions = await this.getPopularQuestions(testId, 3);
			const mostControversialQuestion = await this.getMostControversialQuestion(testId);

			return {
				testId,
				totalParticipants: totalParticipants || 0,
				questionStats,
				popularQuestions,
				mostControversialQuestion,
			};
		} catch (error) {
			handleSupabaseError(error, 'getTestStats');
			return {
				testId,
				totalParticipants: 0,
				questionStats: [],
				popularQuestions: [],
				mostControversialQuestion: null,
			};
		}
	},
};
