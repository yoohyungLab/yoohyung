import { supabase, type TestQuestion, type TestChoice } from '@pickid/supabase';

// ============================================================================
// 타입 정의 (Supabase 기본 타입 기반)
// ============================================================================

// 선택지 통계 (통계 계산용)
export interface IChoiceStats {
	choiceId: string;
	choiceText: string;
	count: number;
	percentage: number;
}

// 질문 통계 (통계 계산용)
export interface IQuestionStats {
	questionId: string;
	questionText: string;
	choiceStats: IChoiceStats[];
	totalResponses: number;
}

// 인기 질문 (통계 계산용 확장 타입)
export interface IPopularQuestion {
	questionId: string;
	questionText: string;
	aChoiceText: string;
	bChoiceText: string;
	aPercentage: number;
	bPercentage: number;
	totalResponses: number;
}

// 밸런스 게임 통계 (통계 계산용 확장 타입)
export interface IBalanceGameStats {
	testId: string;
	totalParticipants: number;
	questionStats: IQuestionStats[];
	popularQuestions: IPopularQuestion[];
	mostControversialQuestion: IPopularQuestion | null;
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

// ============================================================================
// 밸런스 게임 통계 서비스
// ============================================================================

export const balanceGameStatsService = {
	/**
	 * 특정 테스트의 질문별 통계 조회
	 */
	async getQuestionStats(testId: string, questionId: string): Promise<IQuestionStats | null> {
		try {
			// 해당 질문의 모든 응답 조회
			const { data: responses, error } = await supabase
				.from('user_test_responses')
				.select('responses')
				.eq('test_id', testId)
				.not('responses', 'is', null);

			if (error) throw error;

			if (!responses || responses.length === 0) {
				return null;
			}

			// 질문 정보 조회
			const { data: question, error: questionError } = await supabase
				.from('test_questions')
				.select('id, question_text')
				.eq('id', questionId)
				.single();

			if (questionError) throw questionError;

			// 응답 데이터 파싱 및 통계 계산
			const choiceCounts = new Map<string, number>();
			let totalResponses = 0;

			responses.forEach((response) => {
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
			const { data: choices, error: choicesError } = await supabase
				.from('test_choices')
				.select('id, choice_text')
				.eq('question_id', questionId)
				.order('choice_order');

			if (choicesError) throw choicesError;

			// 선택지별 통계 계산
			const choiceStats =
				choices?.map((choice) => {
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
				questionText: question.question_text,
				choiceStats,
				totalResponses,
			};
		} catch (error) {
			handleSupabaseError(error, 'getQuestionStats');
			return null;
		}
	},

	/**
	 * 특정 테스트의 모든 질문 통계 조회
	 */
	async getAllQuestionStats(testId: string): Promise<IQuestionStats[]> {
		try {
			// 테스트의 모든 질문 조회
			const { data: questions, error: questionsError } = await supabase
				.from('test_questions')
				.select('id, question_text')
				.eq('test_id', testId)
				.order('question_order');

			if (questionsError) throw questionsError;

			if (!questions || questions.length === 0) {
				return [];
			}

			// 각 질문별 통계 계산
			const questionStatsPromises = questions.map(async (question) => {
				const stats = await this.getQuestionStats(testId, question.id);
				return stats;
			});

			const questionStats = await Promise.all(questionStatsPromises);
			return questionStats.filter((stats): stats is IQuestionStats => stats !== null);
		} catch (error) {
			handleSupabaseError(error, 'getAllQuestionStats');
			return [];
		}
	},

	/**
	 * 인기 질문들 조회 (의견이 가장 갈린 질문들)
	 */
	async getPopularQuestions(testId: string, limit: number = 3): Promise<IPopularQuestion[]> {
		try {
			const allStats = await this.getAllQuestionStats(testId);

			// 의견이 갈린 질문들을 찾기 (50%에 가까울수록 갈림)
			const controversialQuestions = allStats
				.filter((stats) => stats.choiceStats.length === 2) // 2개 선택지만
				.map((stats) => {
					const [choiceA, choiceB] = stats.choiceStats;
					const aPercentage = choiceA.percentage;
					const bPercentage = choiceB.percentage;

					// 50%에서 얼마나 떨어져 있는지 계산 (낮을수록 갈림)
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
				.sort((a, b) => a.controversyScore - b.controversyScore) // 갈림 정도 순으로 정렬
				.slice(0, limit);

			return controversialQuestions;
		} catch (error) {
			handleSupabaseError(error, 'getPopularQuestions');
			return [];
		}
	},

	/**
	 * 가장 논란이 많은 질문 조회
	 */
	async getMostControversialQuestion(testId: string): Promise<IPopularQuestion | null> {
		try {
			const popularQuestions = await this.getPopularQuestions(testId, 1);
			return popularQuestions[0] || null;
		} catch (error) {
			handleSupabaseError(error, 'getMostControversialQuestion');
			return null;
		}
	},

	/**
	 * 테스트 전체 통계 조회
	 */
	async getTestStats(testId: string): Promise<IBalanceGameStats> {
		try {
			// 전체 참여자 수 조회
			const { count: totalParticipants, error: countError } = await supabase
				.from('user_test_responses')
				.select('*', { count: 'exact', head: true })
				.eq('test_id', testId);

			if (countError) throw countError;

			// 모든 질문 통계 조회
			const questionStats = await this.getAllQuestionStats(testId);

			// 인기 질문들 조회
			const popularQuestions = await this.getPopularQuestions(testId, 3);

			// 가장 논란스러운 질문 조회
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
