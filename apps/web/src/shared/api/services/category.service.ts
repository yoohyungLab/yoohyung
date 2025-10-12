import type { Category } from '@pickid/supabase';
import { supabase } from '@pickid/supabase';

// Category Service - 순수한 API 호출만 담당
export const categoryService = {
	// 활성 카테고리 목록 조회 (웹에서 사용할 카테고리)
	async getActiveCategories(): Promise<Category[]> {
		const { data, error } = await supabase
			.from('categories')
			.select('*')
			.eq('status', 'active')
			.order('sort_order', { ascending: true });

		if (error) {
			console.error('Error fetching active categories:', error);
			throw error;
		}

		console.log('활성 카테고리 데이터:', data);
		return data || [];
	},

	// 모든 카테고리 조회 (관리자용)
	async getAllCategories(): Promise<Category[]> {
		const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching all categories:', error);
			throw error;
		}

		return data || [];
	},

	// 카테고리별 테스트 개수 조회 (최적화된 버전)
	async getCategoryWithTestCounts(): Promise<Array<Category & { test_count: number }>> {
		try {
			// 1. 카테고리 목록 조회
			const { data: categories, error: categoryError } = await supabase
				.from('categories')
				.select('*')
				.eq('status', 'active')
				.order('sort_order', { ascending: true });

			if (categoryError) {
				console.error('Error fetching categories:', categoryError);
				throw categoryError;
			}

			if (!categories || categories.length === 0) {
				return [];
			}

			// 2. 모든 테스트 조회 (한 번만)
			const { data: tests, error: testsError } = await supabase
				.from('tests')
				.select('id, category_ids')
				.eq('status', 'published');

			if (testsError) {
				console.error('Error fetching tests:', testsError);
				// 테스트 조회 실패 시 카테고리만 반환 (test_count = 0)
				return categories.map((category: Category) => ({ ...category, test_count: 0 }));
			}

			// 3. 클라이언트에서 카테고리별 카운트 계산
			const categoryCounts = new Map<string, number>();

			// 각 테스트의 category_ids를 확인하여 카테고리별 카운트 증가
			tests?.forEach((test: { id: string; category_ids?: string[] }) => {
				if (test.category_ids && Array.isArray(test.category_ids)) {
					test.category_ids.forEach((categoryId: string) => {
						const currentCount = categoryCounts.get(categoryId) || 0;
						categoryCounts.set(categoryId, currentCount + 1);
					});
				}
			});

			// 4. 카테고리와 카운트 결합
			const categoriesWithCounts = categories.map((category: Category) => ({
				...category,
				test_count: categoryCounts.get(category.id) || 0,
			}));

			return categoriesWithCounts;
		} catch (error) {
			console.error('Error in getCategoryWithTestCounts:', error);
			// 에러 발생 시 빈 배열 반환
			return [];
		}
	},

	// 특정 카테고리 조회
	async getCategoryById(id: string): Promise<Category | null> {
		const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();

		if (error) {
			console.error('Error fetching category:', error);
			throw error;
		}

		return data;
	},

	// 슬러그로 카테고리 조회
	async getCategoryBySlug(slug: string): Promise<Category | null> {
		const { data, error } = await supabase
			.from('categories')
			.select('*')
			.eq('slug', slug)
			.eq('status', 'active')
			.single();

		if (error) {
			console.error('Error fetching category by slug:', error);
			throw error;
		}

		return data;
	},
};
