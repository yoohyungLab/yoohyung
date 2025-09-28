import { supabase } from '@repo/shared';
import type { Category } from '@repo/supabase';

export const categoryService = {
	// 카테고리 목록 조회
	async getCategories(): Promise<Category[]> {
		const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
		if (error) throw error;
		return data || [];
	},

	// 활성 카테고리만 조회
	async getActiveCategories(): Promise<Category[]> {
		const { data, error } = await supabase
			.from('categories')
			.select('*')
			.eq('is_active', true)
			.order('created_at', { ascending: false });
		if (error) throw error;
		return data || [];
	},

	// 카테고리 생성
	async createCategory(category: {
		name: string;
		description?: string;
		sort_order?: number;
		slug: string;
		is_active?: boolean;
	}): Promise<Category> {
		const categoryData = {
			...category,
			is_active: category.is_active ?? true,
		};
		const { data, error } = await supabase.from('categories').insert(categoryData).select().single();
		if (error) throw error;
		return data;
	},

	// 카테고리 수정
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

	// 상태 변경
	async updateCategoryStatus(id: string, is_active: boolean): Promise<Category> {
		return this.updateCategory(id, { is_active });
	},

	// 대량 상태 변경
	async bulkUpdateStatus(categoryIds: string[], is_active: boolean): Promise<number> {
		const { data, error } = await supabase
			.from('categories')
			.update({ is_active, updated_at: new Date().toISOString() })
			.in('id', categoryIds)
			.select();
		if (error) throw error;
		return data?.length || 0;
	},

	// 카테고리 삭제
	async deleteCategory(id: string): Promise<void> {
		const { error } = await supabase.from('categories').delete().eq('id', id);
		if (error) throw error;
	},
};
