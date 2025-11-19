import { createServerClient, supabase } from '@pickid/supabase';
import type { Category, Test, CategoryWithTestCount, CategoryPageData, AllCategoriesData } from '@pickid/supabase';
import { handleSupabaseError } from '@/shared/lib';

export const categoryService = {
	getClient() {
		return typeof window === 'undefined' ? createServerClient() : supabase;
	},
	async getActiveCategories(): Promise<Category[]> {
		try {
			const client = this.getClient();
			const { data, error } = await client
				.from('categories')
				.select('*')
				.eq('status', 'active')
				.order('sort_order', { ascending: true });

			if (error) throw error;
			return data || [];
		} catch (error) {
			handleSupabaseError(error, 'getActiveCategories');
			return [];
		}
	},

	async getAllCategories(): Promise<Category[]> {
		try {
			const client = this.getClient();
			const { data, error } = await client.from('categories').select('*').order('created_at', { ascending: false });

			if (error) throw error;
			return data || [];
		} catch (error) {
			handleSupabaseError(error, 'getAllCategories');
			return [];
		}
	},

	async getCategoryWithTestCounts(): Promise<CategoryWithTestCount[]> {
		try {
			const client = this.getClient();
			const [categoriesResult, testsResult] = await Promise.all([
				client.from('categories').select('*').eq('status', 'active').order('sort_order', { ascending: true }),
				client.from('tests').select('id, category_ids').eq('status', 'published'),
			]);

			if (categoriesResult.error) throw categoriesResult.error;
			if (testsResult.error) throw testsResult.error;

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
		} catch (error) {
			handleSupabaseError(error, 'getCategoryWithTestCounts');
			return [];
		}
	},

	async getCategoryById(id: string): Promise<Category | null> {
		try {
			const client = this.getClient();
			const { data, error } = await client.from('categories').select('*').eq('id', id).single();

			if (error) throw error;
			return data;
		} catch (error) {
			handleSupabaseError(error, 'getCategoryById');
			return null;
		}
	},

	async getCategoryBySlug(slug: string): Promise<Category | null> {
		try {
			const client = this.getClient();
			const { data, error } = await client
				.from('categories')
				.select('*')
				.eq('slug', slug)
				.eq('status', 'active')
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			handleSupabaseError(error, 'getCategoryBySlug');
			return null;
		}
	},

	async getCategoryPageDataSSR(slug: string): Promise<CategoryPageData | null> {
		try {
			const supabase = createServerClient();

			const [categoryResult, allCategoriesResult] = await Promise.all([
				supabase.from('categories').select('*').eq('slug', slug).eq('status', 'active').single(),
				supabase.from('categories')
					.select('*')
					.eq('status', 'active')
					.order('sort_order', { ascending: true }),
			]);

			if (categoryResult.error || !categoryResult.data) {
				return null;
			}

			const category = categoryResult.data as Category;

			const { data: tests } = await supabase
				.from('tests')
				.select('*')
				.eq('status', 'published')
				.contains('category_ids', [category.id]);

			return { category, allCategories: (allCategoriesResult.data as Category[]) || [], tests: (tests as Test[]) || [] };
		} catch (error) {
			handleSupabaseError(error, 'getCategoryPageDataSSR');
			return null;
		}
	},

	async getAllCategoriesDataSSR(): Promise<AllCategoriesData | null> {
		try {
			const supabase = createServerClient();

			const [categoriesResult, testsResult] = await Promise.all([
				supabase.from('categories').select('*').eq('status', 'active').order('sort_order', { ascending: true }),
				supabase.from('tests').select('*').eq('status', 'published'),
			]);

			if (categoriesResult.error) throw categoriesResult.error;
			if (testsResult.error) throw testsResult.error;

			const categories = categoriesResult.data || [];
			const tests = (testsResult.data as Test[]) || [];

			if (categories.length === 0) console.warn('No active categories found');

			return { allCategories: categories, allTests: tests };
		} catch (error) {
			handleSupabaseError(error, 'getAllCategoriesDataSSR');
			return null;
		}
	},

	transformTestData(tests: Test[]) {
		return tests.map((test) => ({
			id: test.id as string,
			title: test.title as string,
			description: (test.description as string) || '',
			thumbnail_url: (test.thumbnail_url as string) || '/images/placeholder.svg',
			thumbnailUrl: (test.thumbnail_url as string) || '/images/placeholder.svg',
			created_at: test.created_at as string,
			completions: (test.response_count as number) || 0,
			starts: (test.start_count as number) || 0,
			category_ids: (test.category_ids as string[] | null) || undefined,
		}));
	},
};
