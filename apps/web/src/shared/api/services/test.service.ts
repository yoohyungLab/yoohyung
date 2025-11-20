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
import { handleSupabaseError, isNotFoundError } from '@/shared/lib';

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

const USER_RESPONSE_QUERY = `
	*,
	test_results:result_id(*)
`;

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
		let codes: string[] = [];

		if (typeof window !== 'undefined') {
			const storedData = sessionStorage.getItem('testResult');
			if (storedData) {
				try {
					const parsedData = JSON.parse(storedData);
					if (parsedData.testId === testId) {
						responseData = parsedData;
						totalScore = parsedData.totalScore || parsedData.score || 0;
						userGender = parsedData.gender || null;
						// codes가 있으면 사용, 없으면 answers에서 추출
						codes = parsedData.codes || [];
						if (codes.length === 0 && parsedData.answers) {
							codes = parsedData.answers
								.map((a: { code?: string }) => a.code)
								.filter((c: string | undefined): c is string => Boolean(c));
						}
						console.log('[getResponseData] sessionStorage에서 추출:', {
							testId,
							codes,
							hasCodes: parsedData.codes ? parsedData.codes.length : 0,
							answersCount: parsedData.answers ? parsedData.answers.length : 0,
						});
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
				// DB에서 가져올 경우 responses에서 codes 추출
				const responses = userResponses[0].responses as { code?: string }[];
				if (Array.isArray(responses)) {
					codes = responses.map((r) => r.code).filter((c): c is string => Boolean(c));
				}
			}
		}

		return { responseData, totalScore, userGender, codes };
	},

	findMatchingResult(
		responseData: UserTestResponse | null,
		results: TestResult[],
		totalScore: number,
		userGender: string | null,
		codes?: string[]
	): TestResult | null {
		// 이미 저장된 결과가 있고, resultName이 있으면 그대로 사용 (재조회 시)
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

		// 1단계: 성별로 필터링 (target_gender가 null이거나 userGender와 일치하는 결과)
		const genderFilteredResults = userGender
			? results.filter((result) => {
					return !result.target_gender || result.target_gender === userGender;
			  })
			: results;

		let matchingResult: TestResult | null = null;

		// 2단계: 코드 기반 매칭 시도 (코드가 있는 경우)
		if (codes && codes.length > 0) {
			console.log('[findMatchingResult] 코드 매칭 시작:', {
				userCodes: codes,
				genderFilteredCount: genderFilteredResults.length,
				totalResultsCount: results.length,
			});
			matchingResult = this.findResultByCode(genderFilteredResults, codes);

			// 성별 필터링된 결과에서 못 찾으면, 성별 무시하고 코드로만 매칭
			if (!matchingResult) {
				console.log('[findMatchingResult] 성별 필터링에서 매칭 실패, 전체 결과에서 검색');
				matchingResult = this.findResultByCode(results, codes);
			}

			if (matchingResult) {
				console.log('[findMatchingResult] 코드 매칭 성공:', matchingResult.result_name);
			} else {
				console.log('[findMatchingResult] 코드 매칭 실패, 점수 기반 매칭으로 진행');
			}
		} else {
			console.log('[findMatchingResult] 코드가 없음, 점수 기반 매칭으로 진행');
		}

		// 3단계: 코드 매칭 실패 시 점수 기반 매칭 시도
		if (!matchingResult) {
			matchingResult = this.findResultByScore(genderFilteredResults, totalScore);
		}

		// 4단계: 성별 필터링된 결과에서 못 찾으면, 성별 무시하고 점수로만 매칭
		if (!matchingResult) {
			matchingResult = this.findResultByScore(results, totalScore);
		}

		// 5단계: 그래도 없으면 fallback (성별 우선)
		if (!matchingResult && results.length > 0) {
			if (userGender) {
				// 성별에 맞는 첫 번째 결과
				const genderSpecificResult = results.find((r) => r.target_gender === userGender);
				matchingResult = genderSpecificResult || results[0];
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

	/**
	 * 코드 기반 결과 매칭
	 * 1. 사용자 답변 코드의 빈도 계산 및 정렬 (가장 많이 선택된 성향 우선)
	 * 2. 매칭 전략을 순차적으로 시도:
	 *    - 전략 1: 단일 코드 정확 매칭 (예: "P" → "P")
	 *    - 전략 2: 동일 코드 조합 매칭 (예: H 압도적 → "H+H")
	 *    - 전략 3: 상위 2개 코드 조합 (예: H+S, S+H)
	 *    - 전략 4: 조합 코드 포함 여부 (예: "E" → "P+E" 또는 "E+S")
	 */
	findResultByCode(results: TestResult[], codes: string[]): TestResult | null {
		if (!codes || codes.length === 0) {
			console.log('[findResultByCode] codes가 없습니다:', codes);
			return null;
		}

		console.log('[findResultByCode] 사용자 선택 코드:', codes);
		console.log('[findResultByCode] 검색 대상 결과 개수:', results.length);

		// 헬퍼: 코드 기반 매칭 조건 확인
		const hasCodeConditions = (result: TestResult): boolean => {
			if (!result.match_conditions) return false;
			const conditions = result.match_conditions as { type?: string; codes?: string[] };
			return conditions.type === 'code' && Array.isArray(conditions.codes);
		};

		// 헬퍼: 결과의 코드 목록 가져오기
		const getResultCodes = (result: TestResult): string[] => {
			const conditions = result.match_conditions as { type?: string; codes?: string[] };
			return conditions.codes || [];
		};

		// 헬퍼: 특정 코드로 결과 찾기
		const findByCode = (code: string): TestResult | undefined => {
			return results.find((result) => {
				if (!hasCodeConditions(result)) return false;
				return getResultCodes(result).includes(code);
			});
		};

		// 헬퍼: 조합 코드에 특정 코드가 포함되는지 확인 (예: "E"가 "P+E"에 포함)
		const findByCombinationInclusion = (code: string): TestResult | undefined => {
			return results.find((result) => {
				if (!hasCodeConditions(result)) return false;
				return getResultCodes(result).some((resultCode) => {
					if (!resultCode.includes('+')) return false;
					return resultCode.split('+').includes(code);
				});
			});
		};

		// 1. 코드 빈도 계산 및 정렬
		const codeCounts: Record<string, number> = {};
		codes.forEach((code) => {
			if (code) {
				codeCounts[code] = (codeCounts[code] || 0) + 1;
			}
		});

		const sortedEntries = Object.entries(codeCounts).sort((a, b) => b[1] - a[1]);
		const sortedCodes = sortedEntries.map(([code]) => code);

		if (sortedCodes.length === 0) return null;

		console.log('[findResultByCode] 코드 빈도:', codeCounts);
		console.log('[findResultByCode] 정렬된 코드 (빈도순):', sortedCodes);

		// 결과별 match_conditions 확인 (디버깅)
		results.forEach((result, idx) => {
			const conditions = result.match_conditions as { type?: string; codes?: string[] } | null;
			console.log(`[findResultByCode] 결과 ${idx} (${result.result_name}):`, {
				type: conditions?.type,
				codes: conditions?.codes,
			});
		});

		// 2. 매칭 전략 순차 시도
		const dominantCode = sortedCodes[0];
		const dominantCount = codeCounts[dominantCode];
		console.log('[findResultByCode] 가장 많이 선택된 코드:', dominantCode, '빈도:', dominantCount);

		// 전략 1: 단일 코드 정확 매칭
		let matchingResult = findByCode(dominantCode);
		if (matchingResult) {
			console.log(`[findResultByCode] ✓ 단일 코드 매칭 성공: ${matchingResult.result_name}`, {
				userCode: dominantCode,
				resultCodes: getResultCodes(matchingResult),
			});
			return matchingResult;
		}

		// 전략 2: 동일 코드 조합 매칭 (H+H)
		// 조건: 가장 많이 선택된 코드가 압도적일 때 (전체의 60% 이상 또는 2위와 차이가 2배 이상)
		if (sortedCodes.length >= 1) {
			const totalCodes = codes.length;
			const secondCount = sortedCodes.length >= 2 ? codeCounts[sortedCodes[1]] : 0;
			const isDominant = dominantCount / totalCodes >= 0.6 || dominantCount >= secondCount * 2;

			if (isDominant) {
				const sameCodeCombination = `${dominantCode}+${dominantCode}`;
				matchingResult = findByCode(sameCodeCombination);
				if (matchingResult) {
					console.log(`[findResultByCode] ✓ 동일 코드 조합 매칭 성공: ${matchingResult.result_name}`, {
						sameCodeCombination,
						dominantCount,
						totalCodes,
						ratio: (dominantCount / totalCodes * 100).toFixed(1) + '%',
						resultCodes: getResultCodes(matchingResult),
					});
					return matchingResult;
				}
			}
		}

		// 전략 3: 상위 2개 코드 조합 (H+S, S+H)
		if (sortedCodes.length >= 2) {
			const combinedCode = `${sortedCodes[0]}+${sortedCodes[1]}`;
			matchingResult = findByCode(combinedCode);
			if (matchingResult) {
				console.log(`[findResultByCode] ✓ 조합 코드 매칭 성공: ${matchingResult.result_name}`, {
					combinedCode,
					counts: [codeCounts[sortedCodes[0]], codeCounts[sortedCodes[1]]],
					resultCodes: getResultCodes(matchingResult),
				});
				return matchingResult;
			}

			// 역순 조합 시도
			const reverseCombinedCode = `${sortedCodes[1]}+${sortedCodes[0]}`;
			matchingResult = findByCode(reverseCombinedCode);
			if (matchingResult) {
				console.log(`[findResultByCode] ✓ 역순 조합 코드 매칭 성공: ${matchingResult.result_name}`, {
					reverseCombinedCode,
					counts: [codeCounts[sortedCodes[1]], codeCounts[sortedCodes[0]]],
					resultCodes: getResultCodes(matchingResult),
				});
				return matchingResult;
			}
		}

		// 전략 4: 조합 코드에 포함 여부 (예: "E" → "P+E")
		matchingResult = findByCombinationInclusion(dominantCode);
		if (matchingResult) {
			console.log(`[findResultByCode] ✓ 조합 코드 포함 매칭 성공: ${matchingResult.result_name}`, {
				userCode: dominantCode,
				resultCodes: getResultCodes(matchingResult),
			});
			return matchingResult;
		}

		console.log('[findResultByCode] ✗ 매칭 실패: 모든 전략 시도 완료');
		return null;
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



