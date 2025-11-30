import { validateRpcResult } from '@/lib';
import type {
	QuestionWithChoices,
	Test,
	TestChoice,
	TestInsert,
	TestQuestionInsert,
	TestResult,
	TestResultInsert,
	TestStatus,
	TestWithNestedDetails,
} from '@pickid/supabase';
import { supabase } from '@pickid/supabase';


export const testService = {
	async getTests(): Promise<Test[]> {
		const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false });

		if (error) {
			throw new Error(`테스트 목록 조회 실패: ${error.message}`);
		}

		return data || [];
	},

	async getTestWithDetails(testId: string): Promise<TestWithNestedDetails> {
		const { data: testData, error: testError } = await supabase.from('tests').select('*').eq('id', testId).single();

		if (testError) {
			throw new Error(`테스트 정보 조회 실패: ${testError.message}`);
		}

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

		if (questionsError) {
			throw new Error(`질문 목록 조회 실패: ${questionsError.message}`);
		}

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

		if (resultsError) {
			throw new Error(`결과 목록 조회 실패: ${resultsError.message}`);
		}

		const questions: QuestionWithChoices[] = ((questionsData as any) || []).map((q: any) => ({
			id: q.id,
			question_text: q.question_text,
			question_order: q.question_order,
			image_url: q.image_url,
			question_type: q.question_type,
			correct_answers: q.correct_answers,
			explanation: q.explanation,
			created_at: q.created_at,
			updated_at: q.updated_at,
			choices: (q.test_choices || []).map((ch: any) => ({
				id: ch.id,
				choice_text: ch.choice_text,
				choice_order: ch.choice_order,
				score: ch.score ?? 0,
				is_correct: ch.is_correct ?? false,
				code: ch.code ?? null,
			})),
		}));

		const results: TestResult[] = (resultsData as any) || [];

		if (questions.some((q) => !q.choices || q.choices.length === 0)) {
			const ids = questions.map((q) => q.id);
			const { data: rawChoices } = await supabase
				.from('test_choices')
				.select('id, choice_text, choice_order, score, is_correct, code, created_at, question_id')
				.in('question_id', ids)
				.order('choice_order');

			const byQ: Record<string, any[]> = {};
			for (const ch of (rawChoices as any) || []) {
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
					q.choices = (byQ[q.id] || []) as any;
				}
			}
		}

		return {
			test: testData as Test,
			questions,
			results,
		} satisfies TestWithNestedDetails;
	},

	async updateTestStatus(id: string, status: TestStatus): Promise<Test> {
		const updateData: Partial<Test> & { updated_at: string; published_at?: string | null } = {
			status,
			updated_at: new Date().toISOString(),
		};

		if (status === 'published') {
			updateData.published_at = new Date().toISOString();
		} else if (status === 'draft') {
			updateData.published_at = null;
		}

		const { data, error } = await supabase.from('tests').update(updateData).eq('id', id).select().single();

		if (error) {
			throw new Error(`테스트 상태 변경 실패: ${error.message}`);
		}

		return data;
	},

	async deleteTest(id: string): Promise<void> {
		const { data, error } = await supabase.rpc('delete_test', {
			test_uuid: id,
		});

		if (error) {
			throw new Error(`테스트 삭제 실패: ${error.message}`);
		}

		validateRpcResult(data, '테스트 삭제에 실패했습니다.');
	},

	async saveCompleteTest(
		testData: TestInsert,
		questionsData: TestQuestionInsert[],
		resultsData: TestResultInsert[]
	): Promise<TestWithNestedDetails> {
		const isUpdate = !!testData.id;

		if (isUpdate) {
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
	},

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

		const { error: deleteQuestionsError } = await supabase.from('test_questions').delete().eq('test_id', testId);

		if (deleteQuestionsError) throw deleteQuestionsError;

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

		const { error: deleteResultsError } = await supabase.from('test_results').delete().eq('test_id', testId);

		if (deleteResultsError) throw deleteResultsError;

		if (resultsData.length > 0) {
			const resultsToInsert = resultsData.map((result, index) => {
				const matchConditions = result.match_conditions;

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

		return await this.getTestWithDetails(testId);
	},

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

		for (let i = 0; i < questionsData.length; i++) {
			const questionData = questionsData[i];

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

		if (resultsData.length > 0) {
			const resultsToInsert = resultsData.map((result, index) => {
				const matchConditions = result.match_conditions;

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

		return await this.getTestWithDetails(testId);
	},
};
