import type { TestWithNestedDetails } from '@pickid/supabase';

/**
 * TestWithDetails를 TestWithNestedDetails로 변환
 * 중복 코드 제거를 위한 유틸리티 함수
 */
export function mapTestWithDetailsToNested(testData: TestWithNestedDetails): TestWithNestedDetails {
	const result = {
		test: {
			id: testData.test.id,
			title: testData.test.title,
			description: testData.test.description,
			thumbnail_url: testData.test.thumbnail_url,
			intro_text: testData.test.intro_text,
			estimated_time: testData.test.estimated_time,
			max_score: testData.test.max_score,
			status: testData.test.status,
			published_at: testData.test.published_at,
			created_at: testData.test.created_at,
			updated_at: testData.test.updated_at,
			category_ids: testData.test.category_ids,
			response_count: testData.test.response_count,
			start_count: testData.test.start_count,
			requires_gender: testData.test.requires_gender || false,
			features: testData.test.features,
			scheduled_at: null,
			short_code: null,
			slug: '',
			type: testData.test.type || 'test',
		},
		questions:
			testData.questions?.map((question) => {
				const mappedQuestion = {
					id: question.id,
					question_text: question.question_text,
					question_order: question.question_order,
					image_url: question.image_url,
					question_type: question.question_type,
					correct_answers: question.correct_answers,
					explanation: question.explanation,
					created_at: question.created_at,
					updated_at: question.updated_at,
					choices: Array.isArray(question.choices) ? question.choices : [],
				};

				return mappedQuestion;
			}) || [],
		results: testData.results || [],
	};

	return result;
}
