import { createServerClient, supabase } from '@pickid/supabase';
import type { Category, Test, CategoryWithTestCount, CategoryPageData, AllCategoriesData } from '@pickid/supabase';

// Type re-exports
export type { Category, Test, CategoryWithTestCount, CategoryPageData, AllCategoriesData };

// Category Service - 카테고리 관리
// SSR이 필요한 경우 명시적으로 createServerClient() 사용
export const categoryService = {
	async getActiveCategories(): Promise<Category[]> {
		const { data, error } = await supabase
			.from('categories')
			.select('*')
			.eq('status', 'active')
			.order('sort_order', { ascending: true });

		if (error) {
			throw new Error(`활성 카테고리 조회 실패: ${error.message}`);
		}

		return data || [];
	},

	async getAllCategories(): Promise<Category[]> {
		const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });

		if (error) {
			throw new Error(`전체 카테고리 조회 실패: ${error.message}`);
		}

		return data || [];
	},

	async getCategoryWithTestCounts(): Promise<CategoryWithTestCount[]> {
		const [categoriesResult, testsResult] = await Promise.all([
			supabase.from('categories').select('*').eq('status', 'active').order('sort_order', { ascending: true }),
			supabase.from('tests').select('id, category_ids').eq('status', 'published'),
		]);

		if (categoriesResult.error) {
			throw new Error(`카테고리 조회 실패: ${categoriesResult.error.message}`);
		}

		if (testsResult.error) {
			throw new Error(`테스트 조회 실패: ${testsResult.error.message}`);
		}

		const categories = categoriesResult.data || [];
		const tests = testsResult.data || [];

		if (categories.length === 0) return [];

		const categoryCounts = new Map<string, number>();

		tests.forEach((test) => {
			if (test.category_ids && Array.isArray(test.category_ids)) {
				test.category_ids.forEach((categoryId) => {
					const currentCount = categoryCounts.get(categoryId) || 0;
					categoryCounts.set(categoryId, currentCount + 1);
				});
			}
		});

		return categories.map((category) => ({
			...category,
			test_count: categoryCounts.get(category.id) || 0,
		}));
	},

	async getCategoryById(id: string): Promise<Category | null> {
		const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();

		if (error) {
			throw new Error(`카테고리 조회 실패: ${error.message}`);
		}

		return data;
	},

	async getCategoryBySlug(slug: string): Promise<Category | null> {
		const { data, error } = await supabase
			.from('categories')
			.select('*')
			.eq('slug', slug)
			.eq('status', 'active')
			.single();

		if (error) {
			throw new Error(`카테고리 조회 실패: ${error.message}`);
		}

		return data;
	},

	// SSR용 카테고리 페이지 데이터 조회
	async getCategoryPageDataSSR(slug: string): Promise<CategoryPageData | null> {
		const supabaseServer = createServerClient();

		const [categoryResult, allCategoriesResult] = await Promise.all([
			supabaseServer.from('categories').select('*').eq('slug', slug).eq('status', 'active').single(),
			supabaseServer
				.from('categories')
				.select('*')
				.eq('status', 'active')
				.order('sort_order', { ascending: true }),
		]);

		if (categoryResult.error) {
			throw new Error(`카테고리 조회 실패: ${categoryResult.error.message}`);
		}

		if (!categoryResult.data) {
			return null;
		}

		const category = categoryResult.data as Category;

		const { data: tests, error: testsError } = await supabaseServer
			.from('tests')
			.select('*')
			.eq('status', 'published')
			.contains('category_ids', [category.id]);

		if (testsError) {
			throw new Error(`테스트 조회 실패: ${testsError.message}`);
		}

		return {
			category,
			allCategories: (allCategoriesResult.data as Category[]) || [],
			tests: (tests as Test[]) || [],
		};
	},

	// SSR용 전체 카테고리 데이터 조회
	async getAllCategoriesDataSSR(): Promise<AllCategoriesData | null> {
		const supabaseServer = createServerClient();

		const [categoriesResult, testsResult] = await Promise.all([
			supabaseServer.from('categories').select('*').eq('status', 'active').order('sort_order', { ascending: true }),
			supabaseServer.from('tests').select('*').eq('status', 'published'),
		]);

		if (categoriesResult.error) {
			throw new Error(`카테고리 조회 실패: ${categoriesResult.error.message}`);
		}

		if (testsResult.error) {
			throw new Error(`테스트 조회 실패: ${testsResult.error.message}`);
		}

		const categories = categoriesResult.data || [];
		const tests = (testsResult.data as Test[]) || [];

		return { allCategories: categories, allTests: tests };
	},

};
