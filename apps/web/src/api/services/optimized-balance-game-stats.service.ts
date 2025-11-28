import { createServerClient, supabase } from '@pickid/supabase';

// 서비스 반환 타입 (UI 친화적)
export interface ChoiceStatsRaw {
	choiceId: string;
	choiceText: string;
	responseCount: number;
}

export interface QuestionStatsRaw {
	questionId: string;
	questionText: string;
	choices: ChoiceStatsRaw[];
	totalResponses: number;
}

// 헬퍼

function getClient() {
	return typeof window === 'undefined' ? createServerClient() : supabase;
}

// 밸런스게임 통계 서비스 (순수 데이터 접근만)

export const optimizedBalanceGameStatsService = {
	// 선택지 응답 수 증가 (RPC 호출)
	async incrementChoiceCount(choiceId: string): Promise<void> {
		try {
			const client = getClient();
			const { error } = await (
				client.rpc as unknown as { (fn: string, args: { choice_uuid: string }): Promise<{ error: Error | null }> }
			)('increment_choice_response_count', {
				choice_uuid: choiceId,
			});

			if (error) throw error;
		} catch (error) {
			console.error('Error in incrementChoiceCount:', error);
			throw error;
		}
	},

	// 여러 선택지 응답 수 일괄 증가
	async batchIncrementChoices(choiceIds: string[]): Promise<void> {
		const client = getClient();

		// 각 선택지마다 순차적으로 RPC 호출
		for (const choiceId of choiceIds) {
			try {
				const { error } = await client.rpc('increment_choice_response_count', {
					choice_uuid: choiceId,
				});

				if (error) {
					throw error;
				}
			} catch (error) {
				// 하나 실패해도 계속 진행
				console.error(`Error in batchIncrementChoices:${choiceId}`, error);
			}
		}
	},

	// 특정 질문의 선택지 통계 조회 (원시 데이터)
	async getQuestionStatsRaw(questionId: string): Promise<QuestionStatsRaw> {
		try {
			const client = getClient();
			const { data: choices, error } = await client
				.from('test_choices')
				.select('id, choice_text, response_count')
				.eq('question_id', questionId)
				.order('choice_order');

			if (error) throw error;

			const totalResponses = (choices || []).reduce((sum, choice) => sum + (choice.response_count || 0), 0);

			return {
				questionId,
				questionText: '',
				choices: (choices || []).map((choice) => ({
					choiceId: choice.id,
					choiceText: choice.choice_text,
					responseCount: choice.response_count || 0,
				})),
				totalResponses,
			};
		} catch (error) {
			console.error('Error in getQuestionStatsRaw:', error);
			throw error;
		}
	},

	// 테스트의 모든 질문 통계 조회 (원시 데이터)
	async getAllQuestionStatsRaw(testId: string): Promise<QuestionStatsRaw[]> {
		try {
			const client = getClient();
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

			return questions.map((question) => {
				const choices = question.test_choices || [];
				// choice_order로 정렬 (A가 0, B가 1)
				const sortedChoices = [...choices].sort((a, b) => a.choice_order - b.choice_order);
				const totalResponses = sortedChoices.reduce((sum, choice) => sum + (choice.response_count || 0), 0);

				return {
					questionId: question.id,
					questionText: question.question_text,
					choices: sortedChoices.map((choice) => ({
						choiceId: choice.id,
						choiceText: choice.choice_text,
						responseCount: choice.response_count || 0,
					})),
					totalResponses,
				};
			});
		} catch (error) {
			console.error('Error in getAllQuestionStatsRaw:', error);
			throw error;
		}
	},

	// 인기 선택지 조회 (원시 데이터)
	async getPopularChoicesRaw(testId: string, limit: number = 5): Promise<ChoiceStatsRaw[]> {
		try {
			const client = getClient();
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

			return (choices || []).map((choice) => ({
				choiceId: choice.id,
				choiceText: choice.choice_text,
				responseCount: choice.response_count || 0,
			}));
		} catch (error) {
			console.error('Error in getPopularChoicesRaw:', error);
			throw error;
		}
	},
};
