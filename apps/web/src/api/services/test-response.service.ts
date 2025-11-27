import { supabase } from '@pickid/supabase';
import type { UserTestResponse, Database } from '@pickid/supabase';
import type { TestCompletionResult } from '@/types';

// Type definitions
type UserTestResponseInsert = Database['public']['Tables']['user_test_responses']['Insert'];

// Type re-exports
export type { UserTestResponse, UserTestResponseInsert, TestCompletionResult };

const USER_RESPONSE_QUERY = `
	*,
	test_results:result_id(*)
`;

// Test Response Service - 사용자 응답 저장 및 조회
export const testResponseService = {
	// 사용자 응답 저장 (세션/사용자 정보 포함)
	async saveUserResponse(params: {
		testId: string;
		resultId: string;
		answers: { questionId: string; choiceId: string; score: number }[];
		totalScore: number;
		gender?: string;
	}): Promise<UserTestResponse> {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		const insertData = {
			test_id: params.testId,
			result_id: params.resultId,
			user_id: session?.user?.id || null,
			session_id: session ? null : crypto.randomUUID(),
			answers: params.answers as unknown as string,
			total_score: params.totalScore,
			gender: params.gender || null,
			completed_at: new Date().toISOString(),
		} as unknown as UserTestResponseInsert;

		const { data, error } = await supabase.from('user_test_responses').insert(insertData).select().single();

		if (error) {
			throw new Error(`사용자 응답 저장 실패: ${error.message}`);
		}

		return data;
	},

	// 사용자 ID로 응답 조회
	async getUserResponseByUser(testId: string, userId: string): Promise<UserTestResponse | null> {
		const { data, error } = await supabase
			.from('user_test_responses')
			.select(USER_RESPONSE_QUERY)
			.eq('test_id', testId)
			.eq('user_id', userId)
			.order('completed_at', { ascending: false })
			.limit(1)
			.maybeSingle();

		if (error) {
			throw new Error(`사용자 응답 조회 실패: ${error.message}`);
		}

		return data;
	},

	// 세션 ID로 응답 조회
	async getUserResponseBySession(testId: string, sessionId: string): Promise<UserTestResponse | null> {
		const { data, error } = await supabase
			.from('user_test_responses')
			.select(USER_RESPONSE_QUERY)
			.eq('test_id', testId)
			.eq('session_id', sessionId)
			.order('completed_at', { ascending: false })
			.limit(1)
			.maybeSingle();

		if (error) {
			throw new Error(`세션 응답 조회 실패: ${error.message}`);
		}

		return data;
	},

	// 테스트 완료 결과 저장 (전체 프로세스)
	async saveUserTestResponse(result: TestCompletionResult): Promise<void> {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		const insertData = {
			test_id: result.test_id,
			result_id: result.resultId,
			user_id: session?.user?.id || null,
			session_id: session ? null : crypto.randomUUID(),
			answers: result.answers as unknown as string,
			total_score: result.totalScore,
			gender: result.gender || null,
			completed_at: result.completedAt,
		} as unknown as UserTestResponseInsert;

		const { error } = await supabase.from('user_test_responses').insert(insertData);

		if (error) {
			throw new Error(`테스트 응답 저장 실패: ${error.message}`);
		}
	},

	// 테스트 시작 횟수 증가
	async incrementTestStart(testId: string): Promise<void> {
		const { error } = await supabase.rpc('increment_test_start', {
			test_uuid: testId,
		});

		if (error) {
			throw new Error(`테스트 시작 횟수 증가 실패: ${error.message}`);
		}
	},

	// 테스트 완료 횟수 증가
	async incrementTestResponse(testId: string): Promise<void> {
		const { error } = await supabase.rpc('increment_test_response', {
			test_uuid: testId,
		});

		if (error) {
			throw new Error(`테스트 완료 횟수 증가 실패: ${error.message}`);
		}
	},
};
