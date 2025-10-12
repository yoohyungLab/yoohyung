import { supabase } from '@pickid/supabase';
import type { TestResult, UserTestResponse } from '@pickid/supabase';

// ============================================================================
// 타입 정의
// ============================================================================

// 테스트 응답 데이터 - Supabase UserTestResponse 타입 기반
export interface TestResponseData extends Pick<UserTestResponse, 'created_at'> {
	// Supabase에 없는 클라이언트 전용 필드들
	id?: string;
	gender: string;
	result: unknown;
	score: number;
	answers: number[];
}

// 사용자 응답 파라미터 - Supabase UserTestResponse 타입 기반
interface UserResponseParams
	extends Pick<UserTestResponse, 'test_id' | 'user_id' | 'responses' | 'result_id' | 'started_at' | 'completed_at'> {
	// Supabase 필드명을 클라이언트 친화적으로 변경
	testId: string;
	userId: string | null;
	startedAt?: string;
	completedAt?: string;
	score?: number;
}

// ============================================================================
// 쿼리 상수
// ============================================================================

const TEST_FIELDS = `
	id,
	title,
	description,
	slug,
	thumbnail_url,
	start_count,
	response_count,
	category_ids,
	estimated_time,
	requires_gender,
	created_at,
	published_at
`;

const TEST_DETAILS_QUERY = `
	*,
	test_questions:test_questions(
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

const USER_RESPONSE_QUERY = `
	*,
	test_results:result_id(*)
`;

// ============================================================================
// 유틸리티 함수
// ============================================================================

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

const isNotFoundError = (error: unknown) => {
	return (error as { code?: string })?.code === 'PGRST116';
};

// ============================================================================
// 테스트 서비스
// ============================================================================

export const testService = {
	/**
	 * 공개된 모든 테스트 조회
	 */
	async getPublishedTests() {
		try {
			const { data, error } = await supabase
				.from('tests')
				.select(TEST_FIELDS)
				.eq('status', 'published')
				.order('created_at', { ascending: false });

			if (error) throw error;
			return data || [];
		} catch (error) {
			handleSupabaseError(error, 'getPublishedTests');
		}
	},

	/**
	 * ID로 특정 테스트 조회
	 */
	async getTestById(id: string) {
		try {
			const { data, error } = await supabase.from('tests').select('*').eq('id', id).eq('status', 'published').single();

			if (error) throw error;
			return data;
		} catch (error) {
			handleSupabaseError(error, 'getTestById');
		}
	},

	/**
	 * 슬러그로 특정 테스트 조회
	 */
	async getTestBySlug(slug: string) {
		try {
			const { data, error } = await supabase
				.from('tests')
				.select('*')
				.eq('slug', slug)
				.eq('status', 'published')
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			handleSupabaseError(error, 'getTestBySlug');
		}
	},

	/**
	 * 테스트 상세 정보 조회 (질문, 선택지, 결과 포함)
	 */
	async getTestWithDetails(id: string) {
		try {
			const { data, error } = await supabase.from('tests').select(TEST_DETAILS_QUERY).eq('id', id).single();

			if (error) throw error;
			return data;
		} catch (error) {
			handleSupabaseError(error, 'getTestWithDetails');
		}
	},

	/**
	 * 사용자 응답 저장
	 */
	async saveUserResponse(params: UserResponseParams): Promise<UserTestResponse> {
		try {
			const { data, error } = await supabase
				.from('user_test_responses')
				.insert([
					{
						test_id: params.testId,
						user_id: params.userId,
						responses: params.responses,
						result_id: params.result_id,
						score: params.score,
						started_at: params.startedAt,
						completed_at: params.completedAt,
					},
				])
				.select()
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			handleSupabaseError(error, 'saveUserResponse');
			throw error; // 에러를 다시 던져서 호출자가 처리할 수 있도록 함
		}
	},

	/**
	 * 사용자별 응답 조회
	 */
	async getUserResponseByUser(userId: string, testId: string) {
		try {
			const { data, error } = await supabase
				.from('user_test_responses')
				.select(USER_RESPONSE_QUERY)
				.eq('user_id', userId)
				.eq('test_id', testId)
				.single();

			if (error && !isNotFoundError(error)) throw error;
			return data;
		} catch (error) {
			handleSupabaseError(error, 'getUserResponseByUser');
			return null;
		}
	},

	/**
	 * 세션별 응답 조회
	 */
	async getUserResponseBySession(sessionId: string, testId: string) {
		try {
			const { data, error } = await supabase
				.from('user_test_responses')
				.select(USER_RESPONSE_QUERY)
				.eq('user_id', sessionId)
				.eq('test_id', testId)
				.single();

			if (error && !isNotFoundError(error)) throw error;
			return data;
		} catch (error) {
			handleSupabaseError(error, 'getUserResponseBySession');
			return null;
		}
	},

	/**
	 * 테스트 결과 저장
	 */
	async saveTestResult(data: Partial<TestResult>): Promise<TestResult> {
		try {
			const { data: result, error } = await supabase.from('test_results').insert([data]).select().single();

			if (error) throw error;
			return result;
		} catch (error) {
			handleSupabaseError(error, 'saveTestResult');
			throw error;
		}
	},

	/**
	 * 모든 테스트 결과 조회
	 */
	async getTestResults(): Promise<TestResult[]> {
		try {
			const { data, error } = await supabase.from('test_results').select('*').order('created_at', { ascending: false });

			if (error) throw error;
			return data || [];
		} catch (error) {
			handleSupabaseError(error, 'getTestResults');
			throw error;
		}
	},
};
