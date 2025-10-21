import { supabase } from '@pickid/supabase';
import type { Test, TestResult, UserTestResponse, TestQuestion, TestChoice, Json } from '@pickid/supabase';
import type { TestCompletionResult } from '@/shared/types';

// ============================================================================
// 타입 정의 (Supabase 기본 타입 기반)
// ============================================================================

// 테스트 응답 데이터 (레거시 호환용)
export interface TestResponseData extends Pick<UserTestResponse, 'created_at'> {
	id?: string;
	gender: string;
	result: unknown;
	score: number;
	answers: number[];
}

// 사용자 응답 저장 파라미터 (Supabase UserTestResponse 기반)
export interface UserResponseParams {
	testId: string;
	userId: string | null;
	responses: UserTestResponse['responses'];
	result_id: UserTestResponse['result_id'];
	startedAt?: string;
	completedAt?: string;
	score?: number;
}

// 테스트 상세 정보 (Supabase 타입 조합)
export interface TestWithDetails extends Test {
	test_questions: (TestQuestion & {
		test_choices: TestChoice[];
	})[];
	test_results: TestResult[];
}

// 결과 포함 사용자 응답 (Supabase 타입 조합)
export interface UserResponseWithResult extends UserTestResponse {
	test_results: TestResult;
}

// ============================================================================
// 쿼리 상수
// ============================================================================

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
	async getPublishedTests(): Promise<Test[]> {
		try {
			const { data, error } = await supabase
				.from('tests')
				.select('*')
				.eq('status', 'published')
				.order('created_at', { ascending: false });

			if (error) throw error;
			return (data as Test[]) || [];
		} catch (error) {
			handleSupabaseError(error, 'getPublishedTests');
			return [];
		}
	},

	/**
	 * ID로 특정 테스트 조회
	 */
	async getTestById(id: string): Promise<Test | null> {
		try {
			const { data, error } = await supabase.from('tests').select('*').eq('id', id).eq('status', 'published').single();

			if (error) throw error;
			return data as Test;
		} catch (error) {
			handleSupabaseError(error, 'getTestById');
			return null;
		}
	},

	/**
	 * 슬러그로 특정 테스트 조회
	 */
	async getTestBySlug(slug: string): Promise<Test | null> {
		try {
			const { data, error } = await supabase
				.from('tests')
				.select('*')
				.eq('slug', slug)
				.eq('status', 'published')
				.single();

			if (error) throw error;
			return data as Test;
		} catch (error) {
			handleSupabaseError(error, 'getTestBySlug');
			return null;
		}
	},

	/**
	 * 테스트 상세 정보 조회 (질문, 선택지, 결과 포함)
	 */
	async getTestWithDetails(id: string): Promise<TestWithDetails | null> {
		try {
			const { data, error } = await supabase.from('tests').select(TEST_DETAILS_QUERY).eq('id', id).single();

			if (error) throw error;

			return data as TestWithDetails;
		} catch (error) {
			handleSupabaseError(error, 'getTestWithDetails');
			return null;
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
						session_id: params.userId || `session_${Date.now()}`,
						responses: params.responses,
						result_id: params.result_id,
						total_score: params.score || 0,
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
			throw error;
		}
	},

	/**
	 * 사용자별 응답 조회
	 */
	async getUserResponseByUser(userId: string, testId: string): Promise<UserResponseWithResult | null> {
		try {
			const { data, error } = await supabase
				.from('user_test_responses')
				.select(USER_RESPONSE_QUERY)
				.eq('user_id', userId)
				.eq('test_id', testId)
				.single();

			if (error && !isNotFoundError(error)) throw error;
			return data as UserResponseWithResult | null;
		} catch (error) {
			handleSupabaseError(error, 'getUserResponseByUser');
			return null;
		}
	},

	/**
	 * 세션별 응답 조회
	 */
	async getUserResponseBySession(sessionId: string, testId: string): Promise<UserResponseWithResult | null> {
		try {
			const { data, error } = await supabase
				.from('user_test_responses')
				.select(USER_RESPONSE_QUERY)
				.eq('session_id', sessionId)
				.eq('test_id', testId)
				.single();

			if (error && !isNotFoundError(error)) throw error;
			return data as UserResponseWithResult | null;
		} catch (error) {
			handleSupabaseError(error, 'getUserResponseBySession');
			return null;
		}
	},

	/**
	 * 테스트 결과 저장
	 */
	async saveTestResult(insertData: {
		test_id?: string;
		result_name: string;
		result_order: number;
		description?: string | null;
		match_conditions?: Json;
		background_image_url?: string | null;
		theme_color?: string | null;
		features?: Json;
		target_gender?: string | null;
	}): Promise<TestResult> {
		try {
			const { data: result, error } = await supabase.from('test_results').insert([insertData]).select().single();

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

	/**
	 * 특정 테스트의 결과 목록 가져오기
	 */
	async getTestResultsByTestId(testId: string): Promise<TestResult[]> {
		try {
			const { data: results, error: resultsError } = await supabase
				.from('test_results')
				.select(
					`
					id,
					test_id,
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

			return results || [];
		} catch (error) {
			handleSupabaseError(error, 'getTestResultsByTestId');
			return [];
		}
	},

	/**
	 * 세션 스토리지에서 응답 데이터 가져오기
	 */
	async getResponseData(testId: string) {
		let responseData: UserTestResponse | null = null;
		let totalScore = 0;
		let userGender: string | null = null;

		if (typeof window !== 'undefined') {
			const storedData = sessionStorage.getItem('testResult');
			if (storedData) {
				try {
					const parsedData = JSON.parse(storedData);
					if (parsedData.testId === testId && parsedData.resultId !== 'temp') {
						responseData = parsedData;
						totalScore = parsedData.totalScore || 0;
						userGender = parsedData.gender || null;
					}
				} catch (err) {
					console.warn('Failed to parse stored result data:', err);
				}
			}
		}

		if (!responseData) {
			const { data: userResponses } = await supabase
				.from('user_test_responses')
				.select('*')
				.eq('test_id', testId)
				.order('completed_at', { ascending: false })
				.limit(1);

			if (userResponses && userResponses.length > 0) {
				responseData = userResponses[0];
				totalScore = userResponses[0].total_score || 0;
				userGender = (userResponses[0] as { gender?: string })?.gender || null;
			}
		}

		return { responseData, totalScore, userGender };
	},

	/**
	 * 결과 매칭 로직
	 */
	findMatchingResult(
		responseData: UserTestResponse | null,
		results: TestResult[],
		totalScore: number,
		userGender: string | null
	): TestResult | null {
		// 세션 데이터에서 직접 결과가 있는 경우
		if (responseData && 'resultName' in responseData && responseData.resultName && responseData.result_id !== 'temp') {
			const sessionData = responseData as UserTestResponse & {
				resultName: string;
				result_id: string;
				description: string;
				features: Record<string, unknown>;
				theme_color: string;
				background_image_url: string;
			};

			return {
				id: sessionData.result_id,
				result_name: sessionData.resultName,
				description: sessionData.description,
				features: sessionData.features || {},
				theme_color: sessionData.theme_color || '#3B82F6',
				background_image_url: sessionData.background_image_url,
			} as TestResult;
		}

		// 성별 기반 결과 매칭
		const genderFilteredResults = userGender
			? results.filter((result: { target_gender: string | null }) => {
					return !result.target_gender || result.target_gender === userGender;
			  })
			: results;

		// 점수 범위 매칭
		let matchingResult = this.findResultByScore(genderFilteredResults, totalScore);

		// 폴백: 성별 필터링된 결과에서 매칭 실패 시, 성별 무관하게 매칭 시도
		if (!matchingResult && userGender && genderFilteredResults.length > 0) {
			matchingResult = this.findResultByScore(results, totalScore);
		}

		// 최종 폴백: 성별 우선순위로 첫 번째 결과 선택
		if (!matchingResult && results.length > 0) {
			// 성별이 지정된 경우 해당 성별 결과를 우선 선택
			if (userGender) {
				const genderSpecificResult = results.find((r) => r.target_gender === userGender);
				if (genderSpecificResult) {
					matchingResult = genderSpecificResult;
				} else {
					matchingResult = results[0];
				}
			} else {
				matchingResult = results[0];
			}
		}

		return matchingResult as TestResult;
	},

	/**
	 * 점수 범위로 결과 찾기
	 */
	findResultByScore(results: TestResult[], totalScore: number): TestResult | null {
		// 점수 범위별로 정렬하여 가장 정확한 매칭 찾기
		const sortedResults = results
			.filter((result) => result.match_conditions)
			.map((result) => {
				const conditions = result.match_conditions as {
					min?: number;
					max?: number;
					min_score?: number;
					max_score?: number;
				};
				const minScore = conditions.min || conditions.min_score || 0;
				const maxScore = conditions.max || conditions.max_score || 999999;

				return {
					result,
					minScore,
					maxScore,
					range: maxScore - minScore, // 범위가 작을수록 더 정확한 매칭
				};
			})
			.filter((item) => totalScore >= item.minScore && totalScore <= item.maxScore)
			.sort((a, b) => a.range - b.range); // 범위가 가장 작은 것부터 정렬

		if (sortedResults.length > 0) {
			const matchedResult = sortedResults[0].result;
			return matchedResult;
		}

		return null;
	},

	/**
	 * 사용자 테스트 응답 저장
	 */
	async saveUserTestResponse(result: TestCompletionResult): Promise<void> {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			const sessionId = user?.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

			// 응답 저장
			const { error } = await supabase.from('user_test_responses').insert([
				{
					test_id: result.test_id,
					user_id: user?.id || null,
					session_id: sessionId,
					result_id: result.resultId,
					total_score: result.totalScore,
					responses: result.answers as unknown as import('@pickid/supabase').Json,
					gender: result.gender || null,
					started_at: new Date(new Date(result.completedAt).getTime() - result.duration * 1000).toISOString(),
					completed_at: result.completedAt,
					completion_time_seconds: result.duration,
					created_date: new Date().toISOString().split('T')[0],
				},
			]);

			if (error) throw error;
		} catch (error) {
			handleSupabaseError(error, 'saveUserTestResponse');
			throw error;
		}
	},

	/**
	 * 테스트 응답수 증가
	 */
	async incrementTestResponse(testId: string): Promise<void> {
		try {
			await supabase.rpc('increment_test_response', { test_uuid: testId });
		} catch (error) {
			// RPC 실패는 무시 (로그만 남김)
			console.warn('Failed to increment test response count:', error);
		}
	},
};
