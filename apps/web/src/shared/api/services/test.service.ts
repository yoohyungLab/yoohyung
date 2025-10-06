import { supabase } from '@repo/shared';
import type { TestResult, TestResultInsert, UserTestResponse } from '@repo/supabase';
import type { EgenTetoResult, Gender } from '@/shared/types';

// 테스트 응답 데이터 타입 (API에서 사용)
export interface TestResponseData {
	id?: string;
	gender: Gender;
	result: EgenTetoResult;
	score: number;
	answers: number[];
	created_at?: string;
}

// Test Service - API 호출만 담당
export const testService = {
	// 공개된 모든 테스트 조회 (카테고리 정보 포함)
	async getPublishedTests() {
		const { data, error } = await supabase
			.from('tests')
			.select(
				`
				id,
				title,
				description,
				slug,
				thumbnail_url,
				view_count,
				response_count,
				category_ids,
				estimated_time,
				created_at,
				published_at
			`
			)
			.eq('status', 'published')
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data || [];
	},

	// 특정 테스트 조회
	async getTestBySlug(slug: string) {
		const { data, error } = await supabase
			.from('tests')
			.select('*')
			.eq('slug', slug)
			.eq('status', 'published')
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

	// 결과 저장
	async saveTestResult(data: TestResultInsert): Promise<TestResult> {
		const { data: result, error } = await supabase.from('test_results').insert([data]).select().single();

		if (error) throw error;
		return result;
	},

	// 결과 조회
	async getTestResults(): Promise<TestResult[]> {
		const { data, error } = await supabase.from('test_results').select('*').order('created_at', { ascending: false });

		if (error) throw error;
		return data || [];
	},
};
