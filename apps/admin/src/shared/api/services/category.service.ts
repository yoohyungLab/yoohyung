import { supabase } from '@repo/shared';
import type { Category } from '@repo/supabase';
import type { CategoryFilters, CategoryStats, AdminCategoryResponse } from '../types';

// Re-export types for convenience
export type { CategoryFilters, CategoryStats, AdminCategoryResponse };

export const categoryService = {
	async getCategories(
		filters: CategoryFilters = {},
		page: number = 1,
		pageSize: number = 20
	): Promise<{
		categories: Category[];
		total: number;
		totalPages: number;
		currentPage: number;
	}> {
		let query = supabase.from('categories').select('*', { count: 'exact' });

		// 필터 적용
		if (filters.status && filters.status !== 'all') {
			query = query.eq('is_active', filters.status === 'active');
		}
		if (filters.search) {
			query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
		}

		// 페이징 및 정렬
		const { data, count, error } = await query
			.order('sort_order', { ascending: true })
			.range((page - 1) * pageSize, page * pageSize - 1);

		if (error) throw error;

		return {
			categories: data || [],
			total: count || 0,
			totalPages: Math.ceil((count || 0) / pageSize),
			currentPage: page,
		};
	},

	async getAllCategories() {
		const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
		if (error) throw error;
		return data || [];
	},

	async getActiveCategories() {
		const { data, error } = await supabase
			.from('categories')
			.select('*')
			.eq('is_active', true)
			.order('sort_order', { ascending: true });
		if (error) throw error;
		return data || [];
	},

	async getCategoryStats(): Promise<CategoryStats> {
		const { data, error } = await supabase.from('categories').select('is_active');

		if (error) throw error;
		if (!data) return { total: 0, active: 0, inactive: 0 };

		return {
			total: data.length,
			active: data.filter((c: Category) => c.is_active).length,
			inactive: data.filter((c: Category) => !c.is_active).length,
		};
	},

	async createCategory(category: {
		name: string;
		description?: string;
		sort_order?: number;
		slug: string;
		is_active?: boolean;
	}) {
		const categoryData = {
			...category,
			is_active: category.is_active ?? true, // 기본값 true
		};
		const { data, error } = await supabase.from('categories').insert(categoryData).select().single();
		if (error) throw error;
		return data;
	},

	async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
		const { data, error } = await supabase
			.from('categories')
			.update({ ...updates, updated_at: new Date().toISOString() })
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	async updateCategoryStatus(id: string, is_active: boolean): Promise<Category> {
		return this.updateCategory(id, { is_active });
	},

	async bulkUpdateStatus(categoryIds: string[], is_active: boolean): Promise<number> {
		const { data, error } = await supabase
			.from('categories')
			.update({ is_active, updated_at: new Date().toISOString() })
			.in('id', categoryIds)
			.select();

		if (error) throw error;
		return data?.length || 0;
	},

	async deleteCategory(id: string): Promise<void> {
		const { error } = await supabase.from('categories').delete().eq('id', id);
		if (error) throw error;
	},

	async getTestsByCategory(categoryName: string) {
		const { data, error } = await supabase.rpc('get_tests_by_category', {
			category_name: categoryName,
		});
		if (error) throw error;
		return data || [];
	},
};
