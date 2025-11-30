import { supabase } from '@pickid/supabase';
import type { TestResult, TestResultInsert } from '@pickid/supabase';
import { isNotFoundError } from '@pickid/shared';
import { findMatchingResult } from '@/lib/test-result-matching';

type TestResultRow = Pick<TestResult, 'result_name' | 'description' | 'theme_color' | 'match_conditions'>;

export const testResultService = {
	async getQuizResultMessages(testId: string): Promise<TestResultRow[]> {
		const { data, error } = await supabase
			.from('test_results')
			.select('result_name, description, theme_color, match_conditions')
			.eq('test_id', testId)
			.order('result_order', { ascending: true });

		if (error && !isNotFoundError(error)) {
			throw new Error(`퀴즈 결과 메시지 조회 실패: ${error.message}`);
		}

		return (data as TestResultRow[]) || [];
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

	async getResponseData(testId: string) {
		// SessionStorage에서 저장된 결과 확인
		if (typeof window !== 'undefined') {
			const storedResultKey = `test_result_${testId}`;
			const storedResult = sessionStorage.getItem(storedResultKey);

			if (storedResult) {
				try {
					const parsedResult = JSON.parse(storedResult);
					return parsedResult;
				} catch {}
			}
		}

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

	findMatchingResult(
		results: TestResult[],
		totalScore: number,
		answers: Array<{ questionId: string; choiceId: string; code?: string }>,
		gender?: string
	): TestResult | null {
		return findMatchingResult(results, totalScore, answers, gender);
	},
};
