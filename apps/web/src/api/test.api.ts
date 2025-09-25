import { supabase } from '@repo/shared';
import type { TestResult, TestResultInsert, UserTestResponse } from '@repo/supabase';

// 테스트 결과 데이터 타입 (UI에서 사용)
export interface TestResultData {
	id?: string;
	gender: 'male' | 'female';
	result: 'egen-male' | 'egen-female' | 'teto-male' | 'teto-female' | 'mixed';
	score: number;
	answers: number[];
	created_at?: string;
}

// 공통 API 함수들
export const testApi = {
	// 공개된 모든 테스트 조회
	async getPublishedTests() {
		const { data, error } = await supabase
			.from('tests')
			.select(
				`
                *,
                questions:questions(
                    *,
                    question_options:question_options(*)
                ),
                test_results:test_results(*)
            `
			)
			.eq('is_published', true)
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data || [];
	},

	// 특정 테스트 조회
	async getTestBySlug(slug: string) {
		const { data, error } = await supabase
			.from('tests')
			.select(
				`
                *,
                questions:questions(
                    *,
                    question_options:question_options(*)
                ),
                test_results:test_results(*)
            `
			)
			.eq('slug', slug)
			.eq('is_published', true)
			.single();

		if (error) throw error;
		return data;
	},

	// 사용자 응답 저장
	async saveUserResponse(
		testId: string,
		userId: string | null,
		responses: Record<string, unknown>,
		resultId?: string,
		score?: number,
		startedAt?: string,
		completedAt?: string
	): Promise<UserTestResponse> {
		const { data, error } = await supabase
			.from('user_test_responses')
			.insert([
				{
					test_id: testId,
					user_id: userId,
					responses,
					result_id: resultId,
					score,
					started_at: startedAt,
					completed_at: completedAt,
				},
			])
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	// 사용자별 응답 조회
	async getUserResponseByUser(userId: string, testId: string) {
		const { data, error } = await supabase
			.from('user_test_responses')
			.select(
				`
                *,
                test_results:result_id(*)
            `
			)
			.eq('user_id', userId)
			.eq('test_id', testId)
			.single();

		if (error && error.code !== 'PGRST116') throw error; // PGRST116는 데이터가 없을 때
		return data;
	},

	// 세션별 응답 조회 (세션 ID를 user_id로 사용하는 경우)
	async getUserResponseBySession(sessionId: string, testId: string) {
		const { data, error } = await supabase
			.from('user_test_responses')
			.select(
				`
                *,
                test_results:result_id(*)
            `
			)
			.eq('user_id', sessionId)
			.eq('test_id', testId)
			.single();

		if (error && error.code !== 'PGRST116') throw error; // PGRST116는 데이터가 없을 때
		return data;
	},
};

// 결과 저장 함수
export const saveTestResult = async (data: TestResultInsert): Promise<TestResult> => {
	try {
		const { data: result, error } = await supabase.from('test_results').insert([data]).select().single();

		if (error) {
			console.error('Error saving test result:', error);
			throw error;
		}

		return result;
	} catch (error) {
		console.error('Failed to save test result:', error);
		throw error;
	}
};

// 결과 조회 함수
export const getTestResults = async (): Promise<TestResult[]> => {
	try {
		const { data, error } = await supabase.from('test_results').select('*').order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching test results:', error);
			throw error;
		}

		return data || [];
	} catch (error) {
		console.error('Failed to fetch test results:', error);
		throw error;
	}
};
