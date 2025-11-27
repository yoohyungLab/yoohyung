import { supabase, createServerClient } from '@pickid/supabase';
import type { Test, TestWithNestedDetails } from '@pickid/supabase';

// Type re-exports
export type { Test, TestWithNestedDetails };

const TEST_DETAILS_QUERY = `
	*,
	test_questions:test_questions(
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
	),
	test_results:test_results(
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
	)
`;

// Test Service - 기본 CRUD 작업
export const testService = {
	// 게시된 테스트 목록 조회
	async getPublishedTests(): Promise<Test[]> {
		const { data, error } = await supabase
			.from('tests')
			.select('*')
			.eq('status', 'published')
			.order('created_at', { ascending: false });

		if (error) {
			throw new Error(`게시된 테스트 목록 조회 실패: ${error.message}`);
		}

		return data || [];
	},

	// ID로 테스트 조회
	async getTestById(id: string): Promise<Test | null> {
		const { data, error } = await supabase.from('tests').select('*').eq('id', id).single();

		if (error) {
			throw new Error(`테스트 조회 실패: ${error.message}`);
		}

		return data;
	},

	// Slug로 테스트 조회
	async getTestBySlug(slug: string): Promise<Test | null> {
		const { data, error } = await supabase
			.from('tests')
			.select('*')
			.eq('slug', slug)
			.eq('status', 'published')
			.single();

		if (error) {
			throw new Error(`테스트 조회 실패: ${error.message}`);
		}

		return data;
	},

	// 상세 정보 포함 테스트 조회 (질문, 선택지, 결과 포함)
	// SSR 지원을 위해 server client 옵션 제공
	async getTestWithDetails(id: string, useServerClient = false): Promise<TestWithNestedDetails | null> {
		const client = useServerClient ? createServerClient() : supabase;

		const { data, error } = await client.from('tests').select(TEST_DETAILS_QUERY).eq('id', id).single();

		if (error) {
			throw new Error(`테스트 상세 조회 실패: ${error.message}`);
		}

		if (!data) return null;

		// Nested join으로 인한 중복 데이터 보정
		const testData = data as any;
		const questions = testData.test_questions || [];
		const results = testData.test_results || [];

		const uniqueQuestionsMap = new Map<string, any>();
		questions.forEach((q: any) => {
			if (!uniqueQuestionsMap.has(q.id)) {
				uniqueQuestionsMap.set(q.id, { ...q, choices: [] });
			}
			const question = uniqueQuestionsMap.get(q.id);
			const rawChoices = q.test_choices || [];
			rawChoices.forEach((ch: any) => {
				if (!question.choices.some((existingChoice: { id: string }) => existingChoice.id === ch.id)) {
					question.choices.push(ch);
				}
			});
		});

		const uniqueQuestions = Array.from(uniqueQuestionsMap.values()).sort(
			(a: any, b: any) => a.question_order - b.question_order
		);

		uniqueQuestions.forEach((q: any) => {
			q.choices.sort((a: any, b: any) => a.choice_order - b.choice_order);
		});

		const uniqueResultsMap = new Map<string, any>();
		results.forEach((r: any) => {
			if (!uniqueResultsMap.has(r.id)) {
				uniqueResultsMap.set(r.id, r);
			}
		});

		const uniqueResults = Array.from(uniqueResultsMap.values()).sort((a: any, b: any) => a.result_order - b.result_order);


		return {
			test: testData,
			questions: uniqueQuestions,
			results: uniqueResults,
		} as TestWithNestedDetails;
	},
};
