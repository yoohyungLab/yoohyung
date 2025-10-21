import { createServerClient } from '@pickid/supabase';
import type { Category, Test } from '@pickid/supabase';
import type { TestCard } from '@/shared/types';

// ============================================================================
// 타입 정의 (Supabase 기본 타입 기반)
// ============================================================================

// 홈 페이지 데이터 (SSR용)
export interface IHomePageData {
	tests: TestCard[];
	categories: Category[]; // Supabase Category 타입
	popularTests: TestCard[];
	recommendedTests: TestCard[];
	topByType: TestCard[];
}

const getCategoryNames = (categoryIds: string[] | null, categories: Category[]): string[] => {
	if (!categoryIds || categoryIds.length === 0) return ['미분류'];

	const categoryNames = categoryIds
		.map((id) => categories.find((cat) => cat.id === id)?.name || '알 수 없음')
		.filter((name) => name !== '알 수 없음');

	return categoryNames.length > 0 ? categoryNames : ['미분류'];
};

const transformToTestCard = (test: Test, categories: Category[]): TestCard => ({
	id: test.id,
	title: test.title,
	description: test.description || '',
	image: test.thumbnail_url || '/images/placeholder.svg',
	tags: getCategoryNames(test.category_ids, categories),
	type: test.type,
	status: test.status,
	slug: test.slug,
	category_ids: test.category_ids,
	thumbnail_url: test.thumbnail_url,
	starts: test.start_count,
	completions: test.response_count,
});

export const homeService = {
	async getHomePageData(): Promise<IHomePageData> {
		try {
			const supabase = createServerClient();

			const [testsData, categoriesData] = await Promise.all([
				supabase.from('tests').select('*').eq('status', 'published').order('created_at', { ascending: false }),
				supabase.from('categories').select('*').eq('status', 'active').order('name'),
			]);

			if (testsData.error) throw testsData.error;
			if (categoriesData.error) throw categoriesData.error;

			const tests = testsData.data || [];
			const categories = categoriesData.data || [];

			const testsAsCards: TestCard[] = tests.map((test) => transformToTestCard(test, categories));

			// 인기 테스트 (참여자 수 기준)
			const popularTests = [...testsAsCards].sort((a, b) => (b.completions || 0) - (a.completions || 0)).slice(0, 6);

			// 추천 테스트 (최근 2주 내 + 시작 횟수 높은 순)
			const twoWeeksAgo = new Date();
			twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

			const recentTests = tests.filter((test) => new Date(test.created_at) >= twoWeeksAgo);

			const recommendedTests =
				recentTests.length > 0
					? recentTests
							.map((test) => transformToTestCard(test, categories))
							.sort((a, b) => (b.starts || 0) - (a.starts || 0))
							.slice(0, 6)
					: [...testsAsCards].sort((a, b) => (b.starts || 0) - (a.starts || 0)).slice(0, 6);

			// 명예의 전당 (완료율 기준)
			const topByType = [...testsAsCards]
				.filter((test) => (test.starts || 0) > 10)
				.map((test) => ({
					...test,
					completionRate: (test.starts || 0) > 0 ? ((test.completions || 0) / (test.starts || 0)) * 100 : 0,
				}))
				.sort((a, b) => {
					if (Math.abs(b.completionRate - a.completionRate) < 0.1) {
						return (b.completions || 0) - (a.completions || 0);
					}
					return b.completionRate - a.completionRate;
				})
				.slice(0, 6);

			return {
				tests: testsAsCards,
				categories,
				popularTests,
				recommendedTests,
				topByType,
			};
		} catch (error) {
			console.error('Failed to get home page data:', error);
			return {
				tests: [],
				categories: [],
				popularTests: [],
				recommendedTests: [],
				topByType: [],
			};
		}
	},
};
