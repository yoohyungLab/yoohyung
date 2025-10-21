import { supabase, type TestQuestion, type TestChoice } from '@pickid/supabase';

// ============================================================================
// 타입 정의 (Supabase 기본 타입 기반 - 통계 계산용)
// ============================================================================

// 선택지 통계 (최적화된 통계 계산용)
export interface IOptimizedChoiceStats {
	choiceId: string;
	choiceText: string;
	responseCount: number;
	percentage: number;
}

// 질문 통계 (최적화된 통계 계산용)
export interface IOptimizedQuestionStats {
	questionId: string;
	questionText: string;
	choiceStats: IOptimizedChoiceStats[];
	totalResponses: number;
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

// ============================================================================
// 최적화된 밸런스게임 통계 서비스 (비용 최소화)
// ============================================================================

export const optimizedBalanceGameStatsService = {
	/**
	 * 선택지 카운트 증가 (원자적 연산)
	 */
	async incrementChoiceCount(choiceId: string): Promise<void> {
		try {
			const { error } = await supabase.rpc('increment_choice_response_count', {
				choice_uuid: choiceId,
			});

			if (error) throw error;
		} catch (error) {
			handleSupabaseError(error, 'incrementChoiceCount');
		}
	},

	/**
	 * 질문별 통계 조회 (최적화된 단일 쿼리)
	 */
	async getQuestionStats(questionId: string): Promise<IOptimizedQuestionStats | null> {
		try {
			// 단일 쿼리로 모든 데이터 조회
			const { data: choices, error } = await supabase
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

			// 총 응답 수 계산
			const totalResponses = choices.reduce((sum, choice) => sum + (choice.response_count || 0), 0);

			// 선택지별 통계 계산
			const choiceStats: IOptimizedChoiceStats[] = choices.map((choice) => ({
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

	/**
	 * 테스트 전체 통계 조회 (최적화된 쿼리)
	 */
	async getAllQuestionStats(testId: string): Promise<IOptimizedQuestionStats[]> {
		try {
			// JOIN으로 한 번에 모든 데이터 조회
			const { data: questions, error } = await supabase
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

			if (!questions || questions.length === 0) {
				return [];
			}

			// 질문별 통계 계산
			return questions.map((question) => {
				const choices = question.test_choices || [];
				const totalResponses = choices.reduce(
					(sum: number, choice: { response_count: number | null }) => sum + (choice.response_count || 0),
					0
				);

				const choiceStats: IOptimizedChoiceStats[] = choices.map(
					(choice: { id: string; choice_text: string; response_count: number | null }) => ({
						choiceId: choice.id,
						choiceText: choice.choice_text,
						responseCount: choice.response_count || 0,
						percentage: totalResponses > 0 ? Math.round(((choice.response_count || 0) / totalResponses) * 100) : 0,
					})
				);

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

	/**
	 * 인기 선택지 조회 (간단한 쿼리)
	 */
	async getPopularChoices(testId: string, limit: number = 5): Promise<IOptimizedChoiceStats[]> {
		try {
			const { data: choices, error } = await supabase
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
				percentage: 0, // 전체 대비 비율은 별도 계산 필요
			}));
		} catch (error) {
			handleSupabaseError(error, 'getPopularChoices');
			return [];
		}
	},
};
