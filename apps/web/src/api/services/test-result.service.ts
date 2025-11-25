import { supabase } from '@pickid/supabase';
import type { TestResult, TestChoice, Database } from '@pickid/supabase';
import { isNotFoundError } from '@/lib';

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

/**
 * Test Result Service - 결과 조회 및 매칭 로직
 */
export const testResultService = {
	/**
	 * 퀴즈 결과 메시지 조회
	 */
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

	/**
	 * 테스트 결과 저장
	 */
	async saveTestResult(insertData: TestResultInsert): Promise<TestResult> {
		const { data, error } = await supabase.from('test_results').insert(insertData).select().single();

		if (error) {
			throw new Error(`테스트 결과 저장 실패: ${error.message}`);
		}

		return data;
	},

	/**
	 * 테스트 결과 전체 조회
	 */
	async getTestResults(): Promise<TestResult[]> {
		const { data, error } = await supabase.from('test_results').select('*');

		if (error) {
			throw new Error(`테스트 결과 조회 실패: ${error.message}`);
		}

		return data || [];
	},

	/**
	 * 테스트 ID로 결과 조회
	 */
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

	/**
	 * 응답 데이터 기반 결과 조회
	 * SessionStorage 및 DB에서 응답 조회 후 매칭 결과 반환
	 */
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

	/**
	 * 점수/코드 기반 결과 매칭
	 */
	async findMatchingResult(
		results: TestResult[],
		totalScore: number,
		answers: Array<{ questionId: string; choiceId: string; code?: string }>,
		gender?: string
	): Promise<TestResult | null> {
		if (results.length === 0) return null;

		// 코드 기반 매칭 시도
		const codes = answers.map((a) => a.code).filter(Boolean) as string[];

		if (codes.length > 0) {
			const codeMatchedResult = this.findResultByCode(codes, results, gender);
			if (codeMatchedResult) {
				return codeMatchedResult;
			}
		}

		// 점수 기반 매칭
		return this.findResultByScore(totalScore, results, gender);
	},

	/**
	 * 점수 기반 결과 매칭
	 */
	findResultByScore(totalScore: number, results: TestResult[], gender?: string): TestResult | null {
		// 성별 필터링된 결과 우선
		let filteredResults = results;

		if (gender) {
			const genderResults = results.filter(
				(r) => r.target_gender === null || r.target_gender === gender || r.target_gender === 'all'
			);

			if (genderResults.length > 0) {
				filteredResults = genderResults;
			}
		}

		// match_conditions에서 min/max 범위로 매칭
		for (const result of filteredResults) {
			const conditions = result.match_conditions as { type?: string; min?: number; max?: number } | null;

			if (conditions && conditions.type === 'score') {
				const min = conditions.min ?? 0;
				const max = conditions.max ?? Infinity;

				if (totalScore >= min && totalScore <= max) {
					return result;
				}
			}
		}

		// 매칭 실패 시 첫 번째 결과 반환
		return filteredResults[0] || results[0] || null;
	},

	/**
	 * 코드 기반 결과 매칭
	 */
	findResultByCode(codes: string[], results: TestResult[], gender?: string): TestResult | null {
		if (codes.length === 0) return null;

		// 코드 빈도 계산
		const codeCounts = new Map<string, number>();
		codes.forEach((code) => {
			codeCounts.set(code, (codeCounts.get(code) || 0) + 1);
		});

		const sortedCodes = Array.from(codeCounts.entries())
			.sort((a, b) => b[1] - a[1])
			.map(([code]) => code);

		const dominantCode = sortedCodes[0];
		const dominantCount = codeCounts.get(dominantCode) || 0;

		// 성별 필터링
		let filteredResults = results;
		if (gender) {
			const genderResults = results.filter(
				(r) => r.target_gender === null || r.target_gender === gender || r.target_gender === 'all'
			);

			if (genderResults.length > 0) {
				filteredResults = genderResults;
			}
		}

		// 전략 1: 단일 코드 매칭
		for (const result of filteredResults) {
			const conditions = result.match_conditions as { type?: string; codes?: string[] } | null;

			if (conditions && conditions.type === 'code') {
				const resultCodes = conditions.codes || [];

				if (resultCodes.length === 1 && resultCodes[0] === dominantCode) {
					return result;
				}
			}
		}

		// 전략 2: 조합 코드 매칭
		const codeString = codes.join(',');

		for (const result of filteredResults) {
			const conditions = result.match_conditions as { type?: string; codes?: string[] } | null;

			if (conditions && conditions.type === 'code') {
				const resultCodes = conditions.codes || [];
				const resultCodeString = resultCodes.join(',');

				// 정확한 조합 매칭
				if (resultCodeString === codeString) {
					return result;
				}

				// 부분 매칭 (모든 코드 포함)
				if (sortedCodes.every((code) => resultCodes.includes(code))) {
					return result;
				}

				// 역순 조합 매칭
				const reversedString = [...resultCodes].reverse().join(',');
				if (reversedString === codeString) {
					return result;
				}
			}
		}

		// 전략 3: 포함 매칭
		for (const result of filteredResults) {
			const conditions = result.match_conditions as { type?: string; codes?: string[] } | null;

			if (conditions && conditions.type === 'code') {
				const resultCodes = conditions.codes || [];

				if (resultCodes.some((code) => sortedCodes.includes(code))) {
					return result;
				}
			}
		}

		return null;
	},
};
