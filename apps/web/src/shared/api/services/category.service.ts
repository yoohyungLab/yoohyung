import type { Category, Test } from '@pickid/supabase';
import { supabase } from '@pickid/supabase';
import { createServerClient } from '@pickid/supabase';

// ============================================================================
// 타입 정의 (Supabase Category 타입 기반 확장)
// ============================================================================

// Category에 테스트 개수를 추가한 확장 타입
export interface ICategoryWithTestCount extends Category {
	test_count: number;
}

// 카테고리 페이지 데이터 (SSR용)
export interface ICategoryPageData {
	category: Category;
	allCategories: Category[];
	tests: Test[];
}

// 전체 카테고리 데이터 (SSR용)
export interface IAllCategoriesData {
	allCategories: Category[];
	allTests: Test[];
}

export const categoryService = {
	/** 활성 카테고리 목록 조회 (CSR) */
	async getActiveCategories(): Promise<Category[]> {
		try {
			const { data, error } = await supabase
				.from('categories')
				.select('*')
				.eq('status', 'active')
				.order('sort_order', { ascending: true });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error('Failed to get active categories:', error);
			return [];
		}
	},

	/** 모든 카테고리 조회 (CSR - 관리자용) */
	async getAllCategories(): Promise<Category[]> {
		try {
			const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error('Failed to get all categories:', error);
			return [];
		}
	},

	/** 카테고리별 테스트 개수 조회 (CSR) */
	async getCategoryWithTestCounts(): Promise<ICategoryWithTestCount[]> {
		try {
			const [categoriesResult, testsResult] = await Promise.all([
				supabase.from('categories').select('*').eq('status', 'active').order('sort_order', { ascending: true }),
				supabase.from('tests').select('id, category_ids').eq('status', 'published'),
			]);

			if (categoriesResult.error) throw categoriesResult.error;
			if (testsResult.error) throw testsResult.error;

			const categories = categoriesResult.data || [];
			const tests = testsResult.data || [];

			if (categories.length === 0) return [];

			const categoryCounts = new Map<string, number>();

			tests.forEach((test) => {
				if (test.category_ids && Array.isArray(test.category_ids)) {
					test.category_ids.forEach((categoryId: string) => {
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
			console.error('Failed to get category with test counts:', error);
			return [];
		}
	},

	/** 특정 카테고리 조회 (CSR) */
	async getCategoryById(id: string): Promise<Category | null> {
		try {
			const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Failed to get category by id:', error);
			return null;
		}
	},

	/** 슬러그로 카테고리 조회 (CSR) */
	async getCategoryBySlug(slug: string): Promise<Category | null> {
		try {
			const { data, error } = await supabase
				.from('categories')
				.select('*')
				.eq('slug', slug)
				.eq('status', 'active')
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Failed to get category by slug:', error);
			return null;
		}
	},

	/** 카테고리 페이지 데이터 조회 (SSR) */
	async getCategoryPageDataSSR(slug: string): Promise<ICategoryPageData | null> {
		try {
			const supabase = createServerClient();

			const [categoryResult, allCategoriesResult] = await Promise.all([
				supabase.from('categories').select('*').eq('slug', slug).eq('status', 'active').single(),
				supabase.from('categories').select('*').eq('status', 'active').order('sort_order', { ascending: true }),
			]);

			if (categoryResult.error || !categoryResult.data) {
				return null;
			}

			const category = categoryResult.data;

			const { data: tests } = await supabase
				.from('tests')
				.select('*')
				.eq('status', 'published')
				.contains('category_ids', [category.id]);

			return {
				category,
				allCategories: allCategoriesResult.data || [],
				tests: (tests as Test[]) || [],
			};
		} catch (error) {
			console.error('Failed to get category page data:', error);
			return null;
		}
	},

	/** 모든 카테고리 데이터 조회 (SSR) */
	async getAllCategoriesDataSSR(): Promise<IAllCategoriesData | null> {
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

			if (categories.length === 0) {
				console.warn('No active categories found');
			}

			return {
				allCategories: categories,
				allTests: tests,
			};
		} catch (error) {
			console.error('Failed to get all categories data:', error);
			return null;
		}
	},

	/** 테스트 데이터 변환 */
	transformTestData(tests: Test[]) {
		return tests.map((test) => ({
			id: test.id,
			title: test.title,
			description: test.description || '',
			thumbnail_url: test.thumbnail_url || '/images/placeholder.svg',
			thumbnailUrl: test.thumbnail_url || '/images/placeholder.svg',
			created_at: test.created_at,
			completions: test.response_count || 0,
			starts: test.start_count || 0,
			category_ids: test.category_ids || undefined,
		}));
	},
};
