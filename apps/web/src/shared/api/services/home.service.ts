import { createServerClient, supabase } from '@pickid/supabase';
import type { Category, Test, TestCard, HomePageData } from '@pickid/supabase';

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

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

export const homeService = {
	getClient() {
		return typeof window === 'undefined' ? createServerClient() : supabase;
	},

	async getHomePageData(): Promise<HomePageData> {
		try {
			const client = this.getClient();

			const [testsData, categoriesData] = await Promise.all([
				client.from('tests').select('*').eq('status', 'published').order('created_at', { ascending: false }),
				client.from('categories').select('*').eq('status', 'active').order('name'),
			]);

			if (testsData.error) throw testsData.error;
			if (categoriesData.error) throw categoriesData.error;

			const tests = testsData.data || [];
			const categories = categoriesData.data || [];
			const testsAsCards: TestCard[] = tests.map((test) => transformToTestCard(test, categories));

			const popularTests = [...testsAsCards].sort((a, b) => (b.completions || 0) - (a.completions || 0)).slice(0, 6);

			const twoWeeksAgo = new Date();
			twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const recentTests = (tests as any[]).filter((test: any) => new Date(test.created_at) >= twoWeeksAgo);

			const recommendedTests =
				recentTests.length > 0
					? recentTests
							.map((test) => transformToTestCard(test, categories))
							.sort((a, b) => (b.starts || 0) - (a.starts || 0))
							.slice(0, 6)
					: [...testsAsCards].sort((a, b) => (b.starts || 0) - (a.starts || 0)).slice(0, 6);

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

			return { tests: testsAsCards, categories, popularTests, recommendedTests, topByType };
		} catch (error) {
			handleSupabaseError(error, 'getHomePageData');
			return { tests: [], categories: [], popularTests: [], recommendedTests: [], topByType: [] };
		}
	},
};
