import type { TestResult } from '@pickid/supabase';

// 테스트 결과 매칭 로직
// 점수/코드 기반 결과 매칭 알고리즘

// 점수/코드 기반 결과 매칭
export function findMatchingResult(
	results: TestResult[],
	totalScore: number,
	answers: Array<{ questionId: string; choiceId: string; code?: string }>,
	gender?: string
): TestResult | null {
	if (results.length === 0) return null;

	// 코드 기반 매칭 시도
	const codes = answers.map((a) => a.code).filter(Boolean) as string[];

	if (codes.length > 0) {
		const codeMatchedResult = findResultByCode(codes, results, gender);
		if (codeMatchedResult) {
			return codeMatchedResult;
		}
	}

	// 점수 기반 매칭
	return findResultByScore(totalScore, results, gender);
}

// 점수 기반 결과 매칭
export function findResultByScore(totalScore: number, results: TestResult[], gender?: string): TestResult | null {
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
}

// 코드 기반 결과 매칭
export function findResultByCode(codes: string[], results: TestResult[], gender?: string): TestResult | null {
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
}
