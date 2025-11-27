import type { Test, Category, TestCard } from '@pickid/supabase';
import { transformTestsToCards } from './transforms';

// 홈 페이지 데이터 가공 유틸리티

// 인기 테스트 (완료 수 기준)
export function getPopularTests(tests: Test[], categories: Category[], limit = 6): TestCard[] {
	const testCards = transformTestsToCards(tests, categories);
	return [...testCards].sort((a, b) => (b.completions || 0) - (a.completions || 0)).slice(0, limit);
}

// 추천 테스트 (최근 2주 내 테스트 중 시작 수 기준)
export function getRecommendedTests(tests: Test[], categories: Category[], limit = 6): TestCard[] {
	const testCards = transformTestsToCards(tests, categories);

	const twoWeeksAgo = new Date();
	twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

	const recentTests = tests.filter((test) => new Date(test.created_at) >= twoWeeksAgo);

	if (recentTests.length > 0) {
		return recentTests
			.map((test) => testCards.find((card) => card.id === test.id)!)
			.filter(Boolean)
			.sort((a, b) => (b.starts || 0) - (a.starts || 0))
			.slice(0, limit);
	}

	// 최근 테스트가 없으면 전체에서 시작 수 기준으로 정렬
	return [...testCards].sort((a, b) => (b.starts || 0) - (a.starts || 0)).slice(0, limit);
}

// 명예의 전당 (완료율 기준)
export function getTopTests(tests: Test[], categories: Category[], limit = 6): TestCard[] {
	const testCards = transformTestsToCards(tests, categories);

	return [...testCards]
		.filter((test) => (test.starts || 0) > 10) // 최소 10회 이상 시작된 테스트만
		.map((test) => ({
			...test,
			completionRate: (test.starts || 0) > 0 ? ((test.completions || 0) / (test.starts || 0)) * 100 : 0,
		}))
		.sort((a, b) => {
			// 완료율이 비슷하면 완료 수로 정렬
			if (Math.abs(b.completionRate - a.completionRate) < 0.1) {
				return (b.completions || 0) - (a.completions || 0);
			}
			return b.completionRate - a.completionRate;
		})
		.slice(0, limit);
}

// 홈 페이지 데이터 일괄 가공
export function prepareHomePageData(tests: Test[], categories: Category[]) {
	const testCards = transformTestsToCards(tests, categories);

	return {
		tests: testCards,
		categories,
		popularTests: getPopularTests(tests, categories),
		recommendedTests: getRecommendedTests(tests, categories),
		topByType: getTopTests(tests, categories),
	};
}
