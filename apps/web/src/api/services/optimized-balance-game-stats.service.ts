import { createServerClient, supabase } from '@pickid/supabase';
import { handleSupabaseError } from '@/lib';

// 타입 정의

interface RawChoiceData {
	id: string;
	choice_text: string;
	response_count: number;
}

interface RawQuestionData {
	id: string;
	question_text: string;
	test_choices: Array<{
		id: string;
		choice_text: string;
		response_count: number;
		choice_order: number;
	}>;
}

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
			handleSupabaseError(error, 'incrementChoiceCount');
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
				handleSupabaseError(error, `batchIncrementChoices:${choiceId}`);
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

			const rawChoices = (choices || []) as RawChoiceData[];
			const totalResponses = rawChoices.reduce((sum, choice) => sum + (choice.response_count || 0), 0);

			return {
				questionId,
				questionText: '',
				choices: rawChoices.map((choice) => ({
					choiceId: choice.id,
					choiceText: choice.choice_text,
					responseCount: choice.response_count || 0,
				})),
				totalResponses,
			};
		} catch (error) {
			handleSupabaseError(error, 'getQuestionStatsRaw');
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

			const rawQuestions = questions as RawQuestionData[];

			return rawQuestions.map((question) => {
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
			handleSupabaseError(error, 'getAllQuestionStatsRaw');
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

			return ((choices || []) as RawChoiceData[]).map((choice) => ({
				choiceId: choice.id,
				choiceText: choice.choice_text,
				responseCount: choice.response_count || 0,
			}));
		} catch (error) {
			handleSupabaseError(error, 'getPopularChoicesRaw');
			throw error;
		}
	},
};
