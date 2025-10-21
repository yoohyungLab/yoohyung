import type { TestWithDetails } from '@/shared/api/services/test.service';
import type { TestWithNestedDetails } from '@pickid/supabase';

/**
 * TestWithDetails를 TestWithNestedDetails로 변환
 * 중복 코드 제거를 위한 유틸리티 함수
 */
export function mapTestWithDetailsToNested(testData: TestWithDetails): TestWithNestedDetails {
	return {
		test: {
			id: testData.id,
			title: testData.title,
			description: testData.description,
			thumbnail_url: testData.thumbnail_url,
			intro_text: testData.intro_text,
			estimated_time: testData.estimated_time,
			max_score: testData.max_score,
			status: testData.status,
			published_at: testData.published_at,
			created_at: testData.created_at,
			updated_at: testData.updated_at,
			category_ids: testData.category_ids,
			response_count: testData.response_count,
			start_count: testData.start_count,
			requires_gender: testData.requires_gender || false,
			scheduled_at: null,
			short_code: null,
			slug: '',
			type: testData.type || 'test',
		},
		questions: (testData.test_questions || []).map((q) => ({
			...q,
			created_at: q.created_at || new Date().toISOString(),
			updated_at: q.updated_at || new Date().toISOString(),
			choices: q.test_choices || [],
		})),
		results: testData.test_results || [],
	};
}
