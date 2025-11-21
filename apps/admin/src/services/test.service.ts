import { supabase } from '@pickid/supabase';
import type {
	Database,
	QuestionWithChoices,
	Test,
	TestChoice,
	TestQuestion,
	TestResult,
	TestStatus,
	TestWithNestedDetails,
} from '@pickid/supabase';
import { handleSupabaseError, validateRpcResult } from '@/shared/lib';

// 타입 정의

type TestInsert = Database['public']['Tables']['tests']['Insert'];
type TestQuestionInsert = Database['public']['Tables']['test_questions']['Insert'];
type TestResultInsert = Database['public']['Tables']['test_results']['Insert'];

export interface QuestionCreationData extends Omit<TestQuestion, 'id' | 'test_id' | 'created_at' | 'updated_at'> {
	choices: ChoiceCreationData[];
}

export interface ChoiceCreationData extends Omit<TestChoice, 'id' | 'question_id' | 'created_at'> {
	score_value?: number; // score 필드의 별칭 (옵셔널로 변경)
}

export interface ResultCreationData extends Omit<TestResult, 'id' | 'test_id' | 'created_at' | 'updated_at'> {
	result_type?: string; // 추가 필드
	result_title?: string; // result_name의 별칭
	result_description?: string; // description의 별칭
	result_image_url?: string | null; // background_image_url의 별칭
	score_min?: number; // match_conditions에서 추출
	score_max?: number; // match_conditions에서 추출
	order_index?: number; // result_order의 별칭
}

// 유틸리티 함수는 shared/lib로 이동되었습니다

// 테스트 서비스

export const testService = {
	/**
	 * 모든 테스트 목록 조회
	 */
	async getTests(): Promise<Test[]> {
		try {
			const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false });

			if (error) throw error;
			return data || [];
		} catch (error) {
			handleSupabaseError(error, 'getTests');
			return [];
		}
	},

	/**
	 * 테스트 상세 조회 (질문, 결과 포함)
	 */
	async getTestWithDetails(testId: string): Promise<TestWithNestedDetails> {
		try {
			// RPC 함수 대신 직접 쿼리 사용 (target_gender 필드 포함)
			const { data: testData, error: testError } = await supabase.from('tests').select('*').eq('id', testId).single();

			if (testError) throw testError;

			const { data: questionsData, error: questionsError } = await supabase
				.from('test_questions')
				.select(
					`
					id,
					question_text,
					question_order,
					image_url,
					question_type,
					correct_answers,
					explanation,
					created_at,
					updated_at,
					test_choices:test_choices(
						id,
						choice_text,
						choice_order,
						score,
						is_correct,
						code,
						created_at
					)
				`
				)
				.eq('test_id', testId)
				.order('question_order');

			if (questionsError) throw questionsError;

			const { data: resultsData, error: resultsError } = await supabase
				.from('test_results')
				.select(
					`
					id,
					result_name,
					result_order,
					description,
					match_conditions,
					background_image_url,
					theme_color,
					features,
					target_gender,
					created_at,
					updated_at
				`
				)
				.eq('test_id', testId)
				.order('result_order');

			if (resultsError) throw resultsError;

			// 질문/결과 타입을 명확히 매핑
			type QueryQuestionRow = {
				id: string;
				question_text: string;
				question_order: number;
				image_url: string | null;
				question_type: string;
				correct_answers: string[] | null;
				explanation: string | null;
				created_at: string;
				updated_at: string;
				test_choices: Array<{
					id: string;
					choice_text: string;
					choice_order: number;
					score: number | null;
					is_correct: boolean | null;
					code: string | null;
					created_at: string | null;
				}>;
			};

			const questionRows: QueryQuestionRow[] = (questionsData as unknown as QueryQuestionRow[]) || [];
			const questions: QuestionWithChoices[] = questionRows.map((q) => {
				const mappedChoices = (q.test_choices || []).map((choice) => ({
					id: choice.id,
					choice_text: choice.choice_text,
					choice_order: choice.choice_order,
					score: choice.score ?? 0,
					is_correct: choice.is_correct ?? false,
					code: choice.code ?? null,
					created_at: choice.created_at,
					last_updated: null,
					response_count: 0,
					question_id: null,
				}));
				const mapped = {
					id: q.id,
					question_text: q.question_text,
					question_order: q.question_order,
					image_url: q.image_url,
					question_type: q.question_type,
					correct_answers: q.correct_answers,
					explanation: q.explanation,
					created_at: q.created_at,
					updated_at: q.updated_at,
					choices: mappedChoices.map((ch) => ({
						id: ch.id,
						choice_text: ch.choice_text,
						choice_order: ch.choice_order,
						score: ch.score,
						is_correct: ch.is_correct,
						code: ch.code,
					})),
				};
				return mapped as unknown as QuestionWithChoices;
			});

			const results: TestResult[] = (resultsData as unknown as TestResult[]) || [];

			// Fallback: nested join 보정 - 필요시 직접 조인
			if (questions.some((q) => !q.choices || q.choices.length === 0)) {
				const ids = questions.map((q) => q.id);
				const { data: rawChoices } = await supabase
					.from('test_choices')
					.select('id, choice_text, choice_order, score, is_correct, code, created_at, question_id, choice_order')
					.in('question_id', ids)
					.order('choice_order');

				const byQ: Record<
					string,
					Array<{
						id: string;
						choice_text: string;
						choice_order: number;
						score: number;
						is_correct: boolean;
						code: string | null;
					}>
				> = {};
				for (const ch of (rawChoices as unknown as (TestChoice & { question_id: string; code?: string | null })[]) ||
					[]) {
					if (!byQ[ch.question_id]) byQ[ch.question_id] = [];
					byQ[ch.question_id].push({
						id: ch.id,
						choice_text: ch.choice_text,
						choice_order: ch.choice_order,
						score: ch.score ?? 0,
						is_correct: ch.is_correct ?? false,
						code: ch.code ?? null,
					});
				}

				for (const q of questions) {
					if (!q.choices || q.choices.length === 0) {
						q.choices = (byQ[q.id] || []).map((ch) => ({
							id: ch.id,
							choice_text: ch.choice_text,
							choice_order: ch.choice_order,
							score: ch.score,
							is_correct: ch.is_correct,
							code: ch.code,
						})) as unknown as QuestionWithChoices['choices'];
					}
				}
			}

			return {
				test: testData as Test,
				questions,
				results,
			} satisfies TestWithNestedDetails;
		} catch (error) {
			return handleSupabaseError(error, 'getTestWithDetails');
		}
	},

	/**
	 * 테스트 상태 변경
	 */
	async updateTestStatus(id: string, status: TestStatus): Promise<Test> {
		try {
			// published_at 필드도 함께 업데이트
			const updateData: Partial<Test> & { updated_at: string; published_at?: string | null } = {
				status,
				updated_at: new Date().toISOString(),
			};

			// published로 변경할 때 published_at 설정
			if (status === 'published') {
				updateData.published_at = new Date().toISOString();
			} else if (status === 'draft') {
				updateData.published_at = null;
			}

			const { data, error } = await supabase.from('tests').update(updateData).eq('id', id).select().single();

			if (error) throw error;
			return data;
		} catch (error) {
			return handleSupabaseError(error, 'updateTestStatus');
		}
	},

	/**
	 * 테스트 삭제
	 */
	async deleteTest(id: string): Promise<void> {
		try {
			const { data, error } = await supabase.rpc('delete_test', {
				test_uuid: id,
			});

			if (error) throw error;
			validateRpcResult(data, '테스트 삭제에 실패했습니다.');
		} catch (error) {
			handleSupabaseError(error, 'deleteTest');
		}
	},

	/**
	 * 완전한 테스트 저장 (생성/수정)
	 */
	async saveCompleteTest(
		testData: TestInsert,
		questionsData: TestQuestionInsert[],
		resultsData: TestResultInsert[]
	): Promise<TestWithNestedDetails> {
		try {
			const isUpdate = !!testData.id;

			if (isUpdate) {
				// 수정 모드: updateTestDirectly 사용 (code 필드 지원)
				return await this.updateTestDirectly(
					testData,
					questionsData as Array<
						TestQuestionInsert & {
							choices?: Array<
								Pick<TestChoice, 'choice_text' | 'score' | 'is_correct'> & {
									score_value?: number;
									code?: string | null;
								}
							>;
						}
					>,
					resultsData
				);
			} else {
				// 생성 모드: createTestDirectly 사용 (code 필드 지원)
				return await this.createTestDirectly(
					testData,
					questionsData as Array<
						TestQuestionInsert & {
							choices?: Array<
								Pick<TestChoice, 'choice_text' | 'score' | 'is_correct'> & {
									score_value?: number;
									code?: string | null;
								}
							>;
						}
					>,
					resultsData
				);
			}
		} catch (error) {
			return handleSupabaseError(error, 'saveCompleteTest');
		}
	},

	/**
	 * 테스트 직접 업데이트 (RPC 함수 대신)
	 */
	async updateTestDirectly(
		testData: TestInsert,
		questionsData: Array<
			TestQuestionInsert & {
				choices?: Array<
					Pick<TestChoice, 'choice_text' | 'score' | 'is_correct'> & {
						score_value?: number;
						code?: string | null;
					}
				>;
			}
		>,
		resultsData: TestResultInsert[]
	): Promise<TestWithNestedDetails> {
		const testId = testData.id!;

		// 과도한 콘솔 출력 제거

		// 1. 테스트 기본 정보 업데이트
		const { error: testError } = await supabase
			.from('tests')
			.update({
				title: testData.title,
				description: testData.description,
				slug: testData.slug,
				thumbnail_url: testData.thumbnail_url,
				category_ids: testData.category_ids,
				short_code: testData.short_code,
				intro_text: testData.intro_text,
				status: testData.status,
				published_at: testData.published_at,
				requires_gender: testData.requires_gender,
				estimated_time: testData.estimated_time,
				max_score: testData.max_score,
				type: testData.type,
			})
			.eq('id', testId);

		if (testError) throw testError;

		// 2. 기존 질문과 선택지 삭제
		const { error: deleteQuestionsError } = await supabase.from('test_questions').delete().eq('test_id', testId);

		if (deleteQuestionsError) throw deleteQuestionsError;

		// 3. 모든 질문을 배치로 삽입
		if (questionsData.length > 0) {
			const questionsToInsert = questionsData.map((questionData, i) => ({
				test_id: testId,
				question_text: questionData.question_text,
				question_order: i,
				image_url: questionData.image_url,
				question_type: questionData.question_type || 'multiple_choice',
				correct_answers: questionData.correct_answers || null,
				explanation: questionData.explanation || null,
			}));

			const { data: insertedQuestions, error: questionsError } = await supabase
				.from('test_questions')
				.insert(questionsToInsert)
				.select('id');

			if (questionsError) throw questionsError;
			if (!insertedQuestions || insertedQuestions.length !== questionsData.length) {
				throw new Error('질문 삽입 실패: 예상한 수만큼 삽입되지 않았습니다.');
			}

			// 4. 모든 선택지를 배치로 삽입
			const allChoicesToInsert = questionsData.flatMap((questionData, questionIndex) => {
				if (!questionData.choices || questionData.choices.length === 0) return [];
				return questionData.choices.map(
					(
						choice: Pick<TestChoice, 'choice_text' | 'score' | 'is_correct'> & {
							score_value?: number;
							code?: string | null;
						},
						choiceIndex: number
					) => ({
						question_id: insertedQuestions[questionIndex].id,
						choice_text: choice.choice_text,
						choice_order: choiceIndex,
						score: choice.score ?? choice.score_value ?? null,
						is_correct: choice.is_correct ?? null,
						code: (choice as { code?: string | null }).code || null,
					})
				);
			});

			if (allChoicesToInsert.length > 0) {
				const { error: choicesError } = await supabase.from('test_choices').insert(allChoicesToInsert);

				if (choicesError) throw choicesError;
			}
		}

		// 5. 기존 결과 삭제
		const { error: deleteResultsError } = await supabase.from('test_results').delete().eq('test_id', testId);

		if (deleteResultsError) throw deleteResultsError;

		// 6. 새 결과 삽입
		if (resultsData.length > 0) {
			const resultsToInsert = resultsData.map((result, index) => {
				const matchConditions = result.match_conditions;
				// 디버깅: match_conditions 확인
				if (matchConditions && typeof matchConditions === 'object' && 'type' in matchConditions) {
					console.log(`[updateTestDirectly] 결과 ${index} (${result.result_name}) 저장:`, {
						type: (matchConditions as { type?: string }).type,
						codes: (matchConditions as { codes?: string[] }).codes,
						match_conditions: matchConditions,
					});
				}
				return {
					test_id: testId,
					result_name: result.result_name,
					description: result.description,
					result_order: index,
					background_image_url: result.background_image_url,
					theme_color: result.theme_color,
					match_conditions: matchConditions,
					features: result.features,
					target_gender: result.target_gender,
				};
			});

			const { error: resultsError } = await supabase.from('test_results').insert(resultsToInsert);

			if (resultsError) throw resultsError;
		}

		// 7. 업데이트된 테스트 데이터 반환
		return await this.getTestWithDetails(testId);
	},

	/**
	 * 테스트 직접 생성 (RPC 함수 대신, code 필드 지원)
	 */
	async createTestDirectly(
		testData: TestInsert,
		questionsData: Array<
			TestQuestionInsert & {
				choices?: Array<
					Pick<TestChoice, 'choice_text' | 'score' | 'is_correct'> & {
						score_value?: number;
						code?: string | null;
					}
				>;
			}
		>,
		resultsData: TestResultInsert[]
	): Promise<TestWithNestedDetails> {
		// 1. 테스트 기본 정보 생성
		const { data: testResult, error: testError } = await supabase
			.from('tests')
			.insert({
				title: testData.title,
				description: testData.description,
				slug: testData.slug,
				thumbnail_url: testData.thumbnail_url,
				category_ids: testData.category_ids,
				short_code: testData.short_code,
				intro_text: testData.intro_text,
				status: testData.status,
				published_at: testData.published_at,
				requires_gender: testData.requires_gender,
				estimated_time: testData.estimated_time,
				max_score: testData.max_score,
				type: testData.type,
			})
			.select('id')
			.single();

		if (testError) throw testError;

		const testId = testResult.id;

		// 2. 질문과 선택지 삽입
		for (let i = 0; i < questionsData.length; i++) {
			const questionData = questionsData[i];

			// 질문 삽입
			const { data: questionResult, error: questionError } = await supabase
				.from('test_questions')
				.insert({
					test_id: testId,
					question_text: questionData.question_text,
					question_order: i,
					image_url: questionData.image_url,
					question_type: questionData.question_type || 'multiple_choice',
					correct_answers: questionData.correct_answers || null,
					explanation: questionData.explanation || null,
				})
				.select('id')
				.single();

			if (questionError) throw questionError;

			// 선택지 삽입
			if (questionData.choices && questionData.choices.length > 0) {
				const choicesToInsert = questionData.choices.map(
					(
						choice: Pick<TestChoice, 'choice_text' | 'score' | 'is_correct'> & {
							score_value?: number;
							code?: string | null;
						},
						choiceIndex: number
					) => ({
						question_id: questionResult.id,
						choice_text: choice.choice_text,
						choice_order: choiceIndex,
						score: choice.score ?? choice.score_value ?? null,
						is_correct: choice.is_correct ?? null,
						code: (choice as { code?: string | null }).code || null,
					})
				);

				const { error: choicesError } = await supabase.from('test_choices').insert(choicesToInsert);

				if (choicesError) throw choicesError;
			}
		}

		// 3. 결과 삽입
		if (resultsData.length > 0) {
			const resultsToInsert = resultsData.map((result, index) => {
				const matchConditions = result.match_conditions;
				// 디버깅: match_conditions 확인
				if (matchConditions && typeof matchConditions === 'object' && 'type' in matchConditions) {
					console.log(`[createTestDirectly] 결과 ${index} (${result.result_name}) 저장:`, {
						type: (matchConditions as { type?: string }).type,
						codes: (matchConditions as { codes?: string[] }).codes,
						match_conditions: matchConditions,
					});
				}
				return {
					test_id: testId,
					result_name: result.result_name,
					description: result.description,
					result_order: index,
					background_image_url: result.background_image_url,
					theme_color: result.theme_color,
					match_conditions: matchConditions,
					features: result.features,
					target_gender: result.target_gender,
				};
			});

			const { error: resultsError } = await supabase.from('test_results').insert(resultsToInsert);

			if (resultsError) throw resultsError;
		}

		// 4. 생성된 테스트 데이터 반환
		return await this.getTestWithDetails(testId);
	},
};
