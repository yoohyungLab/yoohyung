import { supabase, createServerClient } from '@pickid/supabase';
import type {
	Json,
	Test,
	TestChoice,
	TestResult,
	TestWithNestedDetails,
	UserTestResponse,
	Database,
} from '@pickid/supabase';

type UserTestResponseInsert = Database['public']['Tables']['user_test_responses']['Insert'];
type TestResultInsert = Database['public']['Tables']['test_results']['Insert'];

import type { TestCompletionResult } from '@/shared/types';

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

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

const isNotFoundError = (error: unknown) => {
	return (error as { code?: string })?.code === 'PGRST116';
};

export const testService = {
	// 클라이언트 팩토리: 공식 가이드에 맞춰 SSR/CSR 분기
	getClient() {
		// Next.js 환경: server components/route handlers 에서는 window 없음
		return typeof window === 'undefined' ? createServerClient() : supabase;
	},
	async getPublishedTests(): Promise<Test[]> {
		try {
			const client = this.getClient();
			const { data, error } = await client
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

	async getTestById(id: string): Promise<Test | null> {
		try {
			const client = this.getClient();
			const { data, error } = await client.from('tests').select('*').eq('id', id).eq('status', 'published').single();

			if (error) throw error;
			return data as Test;
		} catch (error) {
			handleSupabaseError(error, 'getTestById');
			return null;
		}
	},

	async getTestBySlug(slug: string): Promise<Test | null> {
		try {
			const client = this.getClient();
			const { data, error } = await client
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

	async getTestWithDetails(id: string): Promise<TestWithNestedDetails | null> {
		try {
			const client = this.getClient();
			const { data, error } = await client.from('tests').select(TEST_DETAILS_QUERY).eq('id', id).single();

			if (error) throw error;

			// 타입 변환 및 nested join 보정
			const testData = data as Test & {
				test_questions?: Array<{
					id: string;
					question_text: string;
					question_order: number;
					image_url: string | null;
					question_type: string;
					correct_answers: string[] | null;
					explanation: string | null;
					created_at: string;
					updated_at: string;
					test_choices?: unknown[];
				}>;
				test_results?: unknown[];
			};

			// 일부 환경에서 nested join으로 choices가 비어오는 경우가 있어 보정
			if (testData?.test_questions && Array.isArray(testData.test_questions)) {
				// 디버깅: 초기 데이터 확인

				const questionIds = testData.test_questions.map((q) => q.id);
				if (questionIds.length > 0) {
					const { data: rawChoices } = await client
						.from('test_choices')
						.select('id, choice_text, choice_order, score, is_correct, created_at, question_id')
						.in('question_id', questionIds)
						.order('choice_order');

					if (rawChoices) {
						const byQuestion: Record<string, unknown[]> = {};
						rawChoices.forEach((ch) => {
							const choiceData = ch as {
								question_id: string;
								id: string;
								choice_text: string;
								choice_order: number;
								score: number;
								is_correct: boolean;
								created_at: string;
							};
							if (!byQuestion[choiceData.question_id]) byQuestion[choiceData.question_id] = [];
							byQuestion[choiceData.question_id].push({
								id: choiceData.id,
								choice_text: choiceData.choice_text,
								choice_order: choiceData.choice_order,
								score: choiceData.score,
								is_correct: choiceData.is_correct,
								created_at: choiceData.created_at,
							});
						});

						testData.test_questions = testData.test_questions.map((q) => ({
							...q,
							test_choices: byQuestion[q.id] || q.test_choices || [],
						}));
					}
				}
			}

			// TestWithNestedDetails 형식으로 변환
			const result = {
				test: testData as Test,
				questions:
					testData?.test_questions?.map((q) => {
						const mappedQuestion = {
							id: q.id,
							question_text: q.question_text,
							question_order: q.question_order,
							image_url: q.image_url,
							question_type: q.question_type,
							correct_answers: q.correct_answers,
							explanation: q.explanation,
							created_at: q.created_at,
							updated_at: q.updated_at,
							choices: (q.test_choices as TestChoice[]) || [],
						};

						return mappedQuestion;
					}) || [],
				results: (testData?.test_results as TestResult[]) || [],
			};

			return result;
		} catch (error) {
			handleSupabaseError(error, 'getTestWithDetails');
			return null;
		}
	},

	async saveUserResponse(params: {
		testId: string;
		userId: string | null;
		responses: Json;
		result_id: string | null;
		startedAt?: string;
		completedAt?: string;
		score?: number;
	}): Promise<UserTestResponse> {
		try {
			const client = this.getClient();

			const insertData: UserTestResponseInsert = {
				test_id: params.testId,
				user_id: params.userId,
				session_id: params.userId || `session_${Date.now()}`,
				responses: params.responses,
				result_id: params.result_id,
				total_score: params.score || 0,
				started_at: params.startedAt,
				completed_at: params.completedAt,
			};

			const { data, error } = await client.from('user_test_responses').insert(insertData).select().single();

			if (error) throw error;
			return data as UserTestResponse;
		} catch (error) {
			handleSupabaseError(error, 'saveUserResponse');
			throw error;
		}
	},

	async getUserResponseByUser(
		userId: string,
		testId: string
	): Promise<(UserTestResponse & { test_results: TestResult }) | null> {
		try {
			const client = this.getClient();
			const { data, error } = await client
				.from('user_test_responses')
				.select(USER_RESPONSE_QUERY)
				.eq('user_id', userId)
				.eq('test_id', testId)
				.single();

			if (error && !isNotFoundError(error)) throw error;
			return data as (UserTestResponse & { test_results: TestResult }) | null;
		} catch (error) {
			handleSupabaseError(error, 'getUserResponseByUser');
			return null;
		}
	},

	async getUserResponseBySession(
		sessionId: string,
		testId: string
	): Promise<(UserTestResponse & { test_results: TestResult }) | null> {
		try {
			const client = this.getClient();
			const { data, error } = await client
				.from('user_test_responses')
				.select(USER_RESPONSE_QUERY)
				.eq('session_id', sessionId)
				.eq('test_id', testId)
				.single();

			if (error && !isNotFoundError(error)) throw error;
			return data as (UserTestResponse & { test_results: TestResult }) | null;
		} catch (error) {
			handleSupabaseError(error, 'getUserResponseBySession');
			return null;
		}
	},

	async saveTestResult(insertData: TestResultInsert): Promise<TestResult> {
		try {
			const client = this.getClient();
			const { data: result, error } = await client.from('test_results').insert(insertData).select().single();

			if (error) throw error;
			return result as TestResult;
		} catch (error) {
			handleSupabaseError(error, 'saveTestResult');
			throw error;
		}
	},

	async getTestResults(): Promise<TestResult[]> {
		try {
			const client = this.getClient();
			const { data, error } = await client.from('test_results').select('*').order('created_at', { ascending: false });

			if (error) throw error;
			return data || [];
		} catch (error) {
			handleSupabaseError(error, 'getTestResults');
			throw error;
		}
	},

	async getTestResultsByTestId(testId: string): Promise<TestResult[]> {
		try {
			const client = this.getClient();
			const { data: results, error: resultsError } = await client
				.from('test_results')
				.select('*')
				.eq('test_id', testId)
				.order('result_order');

			if (resultsError) throw resultsError;

			return (results as TestResult[]) || [];
		} catch (error) {
			handleSupabaseError(error, 'getTestResultsByTestId');
			return [];
		}
	},

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
			const client = this.getClient();
			const { data: userResponses } = await client
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

	findMatchingResult(
		responseData: UserTestResponse | null,
		results: TestResult[],
		totalScore: number,
		userGender: string | null
	): TestResult | null {
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

		const genderFilteredResults = userGender
			? results.filter((result) => {
					return !result.target_gender || result.target_gender === userGender;
			  })
			: results;

		let matchingResult = this.findResultByScore(genderFilteredResults, totalScore);

		if (!matchingResult && userGender && genderFilteredResults.length > 0) {
			matchingResult = this.findResultByScore(results, totalScore);
		}

		if (!matchingResult && results.length > 0) {
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

	findResultByScore(results: TestResult[], totalScore: number): TestResult | null {
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

				return { result, minScore, maxScore, range: maxScore - minScore };
			})
			.filter((item) => totalScore >= item.minScore && totalScore <= item.maxScore)
			.sort((a, b) => a.range - b.range);

		return sortedResults.length > 0 ? sortedResults[0].result : null;
	},

	async saveUserTestResponse(result: TestCompletionResult): Promise<void> {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			const sessionId = user?.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

			const insertData: UserTestResponseInsert = {
				test_id: result.test_id,
				user_id: user?.id || null,
				session_id: sessionId,
				result_id: result.resultId,
				total_score: result.totalScore,
				responses: result.answers as unknown as Json,
				gender: result.gender || null,
				started_at: new Date(new Date(result.completedAt).getTime() - result.duration * 1000).toISOString(),
				completed_at: result.completedAt,
				completion_time_seconds: result.duration,
				created_date: new Date().toISOString().split('T')[0],
			};

			const { error } = await supabase.from('user_test_responses').insert(insertData);

			if (error) throw error;
		} catch (error) {
			handleSupabaseError(error, 'saveUserTestResponse');
			throw error;
		}
	},

	async incrementTestResponse(testId: string): Promise<void> {
		try {
			await supabase.rpc('increment_test_response', { test_uuid: testId });
		} catch (error) {
			console.warn('Failed to increment test response count:', error);
		}
	},
};
