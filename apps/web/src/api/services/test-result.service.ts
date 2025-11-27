import { supabase } from '@pickid/supabase';
import type { TestResult, Database } from '@pickid/supabase';
import { isNotFoundError } from '@/lib';
import { findMatchingResult } from '@/lib/test-result-matching';

// Type definitions
type TestResultInsert = Database['public']['Tables']['test_results']['Insert'];

interface ITestResultRow {
	result_name: string;
	description: string | null;
	theme_color: string | null;
	match_conditions: { min?: number; max?: number; type?: string } | null;
}

// Type re-exports
export type { TestResult, TestResultInsert, ITestResultRow };

// Test Result Service - 결과 조회
// 매칭 로직은 lib/test-result-matching.ts에서 처리
export const testResultService = {
	// 퀴즈 결과 메시지 조회
	async getQuizResultMessages(testId: string): Promise<ITestResultRow[]> {
		const { data, error } = await supabase
			.from('test_results')
			.select('result_name, description, theme_color, match_conditions')
			.eq('test_id', testId)
			.order('result_order', { ascending: true });

		if (error && !isNotFoundError(error)) {
			throw new Error(`퀴즈 결과 메시지 조회 실패: ${error.message}`);
		}

		return (data as ITestResultRow[]) || [];
	},

	// 테스트 결과 저장
	async saveTestResult(insertData: TestResultInsert): Promise<TestResult> {
		const { data, error } = await supabase.from('test_results').insert(insertData).select().single();

		if (error) {
			throw new Error(`테스트 결과 저장 실패: ${error.message}`);
		}

		return data;
	},

	// 테스트 결과 전체 조회
	async getTestResults(): Promise<TestResult[]> {
		const { data, error } = await supabase.from('test_results').select('*');

		if (error) {
			throw new Error(`테스트 결과 조회 실패: ${error.message}`);
		}

		return data || [];
	},

	// 테스트 ID로 결과 조회
	async getTestResultsByTestId(testId: string): Promise<TestResult[]> {
		const { data, error } = await supabase
			.from('test_results')
			.select('*')
			.eq('test_id', testId)
			.order('result_order', { ascending: true });

		if (error && !isNotFoundError(error)) {
			throw new Error(`테스트 결과 조회 실패: ${error.message}`);
		}

		return data || [];
	},

	// 응답 데이터 기반 결과 조회
	// SessionStorage 및 DB에서 응답 조회 후 매칭 결과 반환
	async getResponseData(testId: string) {
		// SessionStorage에서 저장된 결과 확인
		if (typeof window !== 'undefined') {
			const storedResultKey = `test_result_${testId}`;
			const storedResult = sessionStorage.getItem(storedResultKey);

			if (storedResult) {
				try {
					const parsedResult = JSON.parse(storedResult);
					return parsedResult;
				} catch (err) {
					// JSON 파싱 실패 시 무시하고 DB 조회로 진행
				}
			}
		}

		// DB에서 응답 조회
		const {
			data: { session },
		} = await supabase.auth.getSession();

		let responseData = null;

		if (session?.user?.id) {
			const { data } = await supabase
				.from('user_test_responses')
				.select(
					`
					*,
					test_results:result_id(*)
				`
				)
				.eq('test_id', testId)
				.eq('user_id', session.user.id)
				.order('completed_at', { ascending: false })
				.limit(1)
				.maybeSingle();

			responseData = data;
		}

		return responseData;
	},

	// 점수/코드 기반 결과 매칭 (lib 함수 사용)
	findMatchingResult(
		results: TestResult[],
		totalScore: number,
		answers: Array<{ questionId: string; choiceId: string; code?: string }>,
		gender?: string
	): TestResult | null {
		return findMatchingResult(results, totalScore, answers, gender);
	},
};
