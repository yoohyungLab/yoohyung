import { supabase } from '@pickid/supabase';
import type { Test, TestWithNestedDetails, TestQuestion, TestChoice, TestResult, Database } from '@pickid/supabase';

// ============================================================================
// 타입 정의
// ============================================================================

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
	target_gender?: string | null; // 성별 타겟 필드 추가
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

const handleSupabaseError = (error: any, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

const validateTestData = (testId: string, data: any) => {
	if (!data) {
		throw new Error(`Test with id ${testId} not found`);
	}
	return data;
};

const validateRpcResult = (result: any, errorMessage: string) => {
	if (!result.success) {
		throw new Error(result.error || errorMessage);
	}
	return result;
};

// ============================================================================
// 테스트 서비스
// ============================================================================

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
					created_at,
					updated_at,
					test_choices:test_choices(
						id,
						choice_text,
						choice_order,
						score,
						is_correct,
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

			console.log('직접 쿼리 결과 데이터:', {
				testId,
				hasTestData: !!testData,
				questionsCount: questionsData?.length || 0,
				resultsCount: resultsData?.length || 0,
				questions: questionsData?.map((q: any) => ({
					id: q.id,
					question_text: q.question_text,
					choicesCount: q.test_choices?.length || 0,
					choices:
						q.test_choices?.map((c: any) => ({
							id: c.id,
							choice_text: c.choice_text,
							score: c.score,
						})) || [],
				})),
				results: resultsData?.map((r: any) => ({
					name: r.result_name,
					target_gender: r.target_gender,
					raw: r,
				})),
			});

			return {
				test: testData,
				questions: questionsData || [],
				results: resultsData || [],
			} as TestWithNestedDetails;
		} catch (error) {
			handleSupabaseError(error, 'getTestWithDetails');
		}
	},

	/**
	 * 테스트 상태 변경
	 */
	async updateTestStatus(id: string, status: string): Promise<Test> {
		try {
			console.log('테스트 상태 변경 시도:', { id, status });

			// published_at 필드도 함께 업데이트
			const updateData: any = {
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

			if (error) {
				console.error('테스트 상태 변경 에러:', error);
				throw error;
			}

			console.log('테스트 상태 변경 성공:', data);
			return data;
		} catch (error) {
			console.error('테스트 상태 변경 실패:', error);
			handleSupabaseError(error, 'updateTestStatus');
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
				// 업데이트 모드: 직접 테이블 업데이트
				return await this.updateTestDirectly(testData, questionsData, resultsData);
			} else {
				// 생성 모드: RPC 함수 사용
				const { data: result, error } = await supabase.rpc('create_test_complete', {
					test_data: testData,
					questions_data: questionsData,
					results_data: resultsData,
				});

				if (error) throw error;
				return result as TestWithNestedDetails;
			}
		} catch (error) {
			handleSupabaseError(error, 'saveCompleteTest');
		}
	},

	/**
	 * 테스트 직접 업데이트 (RPC 함수 대신)
	 */
	async updateTestDirectly(
		testData: TestInsert,
		questionsData: TestQuestionInsert[],
		resultsData: TestResultInsert[]
	): Promise<TestWithNestedDetails> {
		const testId = testData.id!;

		console.log('직접 업데이트 시작:', {
			testId,
			questionsCount: questionsData.length,
			resultsCount: resultsData.length,
			questionsData: questionsData.map((q) => ({
				question_text: q.question_text,
				choicesCount: q.choices?.length || 0,
				choices:
					q.choices?.map((c) => ({
						choice_text: c.choice_text,
						score: c.score,
					})) || [],
			})),
		});

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

		// 3. 새 질문과 선택지 삽입
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
				})
				.select('id')
				.single();

			if (questionError) throw questionError;

			// 선택지 삽입
			if (questionData.choices && questionData.choices.length > 0) {
				const choicesToInsert = questionData.choices.map((choice, choiceIndex) => ({
					question_id: questionResult.id,
					choice_text: choice.choice_text,
					choice_order: choiceIndex,
					score: choice.score,
					is_correct: choice.is_correct,
				}));

				const { error: choicesError } = await supabase.from('test_choices').insert(choicesToInsert);

				if (choicesError) throw choicesError;
			}
		}

		// 4. 기존 결과 삭제
		const { error: deleteResultsError } = await supabase.from('test_results').delete().eq('test_id', testId);

		if (deleteResultsError) throw deleteResultsError;

		// 5. 새 결과 삽입
		if (resultsData.length > 0) {
			const resultsToInsert = resultsData.map((result, index) => ({
				test_id: testId,
				result_name: result.result_name,
				description: result.description,
				result_order: index,
				background_image_url: result.background_image_url,
				theme_color: result.theme_color,
				match_conditions: result.match_conditions,
				features: result.features,
				target_gender: result.target_gender,
			}));

			const { error: resultsError } = await supabase.from('test_results').insert(resultsToInsert);

			if (resultsError) throw resultsError;
		}

		// 6. 업데이트된 테스트 데이터 반환
		return await this.getTestWithDetails(testId);
	},
};
