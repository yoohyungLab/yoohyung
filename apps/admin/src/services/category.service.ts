import type { Category } from '@pickid/supabase';
import { supabase } from '@pickid/supabase';

export const categoryService = {
	async getCategories(): Promise<Category[]> {
		const { data, error } = await supabase
			.from('categories')
			.select('id, name, slug, sort_order, status, created_at, updated_at')
			.order('created_at', { ascending: false });
		if (error) throw error;
		return data || [];
	},

	async getActiveCategories(): Promise<Category[]> {
		const { data, error } = await supabase
			.from('categories')
			.select('id, name, slug, sort_order, status, created_at, updated_at')
			.eq('status', 'active')
			.order('created_at', { ascending: false });
		if (error) throw error;
		return data || [];
	},

	async checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
		let query = supabase.from('categories').select('id').eq('slug', slug);
		if (excludeId) {
			query = query.neq('id', excludeId);
		}
		const { data, error } = await query;
		if (error) throw error;
		return (data?.length || 0) > 0;
	},

	async generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
		let slug = baseSlug;
		let counter = 1;

		while (await this.checkSlugExists(slug, excludeId)) {
			slug = `${baseSlug}-${counter}`;
			counter++;
		}

		return slug;
	},

	async createCategory(category: {
		name: string;
		sort_order?: number;
		slug: string;
		status?: 'active' | 'inactive';
	}): Promise<Category> {
		const uniqueSlug = await this.generateUniqueSlug(category.slug);

		const categoryData = {
			...category,
			slug: uniqueSlug,
			status: category.status ?? 'active',
		};
		const { data, error } = await supabase.from('categories').insert(categoryData).select().single();
		if (error) throw error;
		return data;
	},

	async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
		if (updates.slug) {
			const uniqueSlug = await this.generateUniqueSlug(updates.slug, id);
			updates.slug = uniqueSlug;
		}

		const { data, error } = await supabase
			.from('categories')
			.update({ ...updates, updated_at: new Date().toISOString() })
			.eq('id', id)
			.select()
			.single();
		if (error) throw error;
		return data;
	},

	async updateCategoryStatus(id: string, isActive: boolean): Promise<Category> {
		const status = isActive ? 'active' : 'inactive';
		return this.updateCategory(id, { status });
	},

	async bulkUpdateStatus(categoryIds: string[], isActive: boolean): Promise<number> {
		const status = isActive ? 'active' : 'inactive';
		const { data, error } = await supabase
			.from('categories')
			.update({ status, updated_at: new Date().toISOString() })
			.in('id', categoryIds)
			.select();
		if (error) throw error;
		return data?.length || 0;
	},

	async deleteCategory(id: string): Promise<void> {
		const { error } = await supabase.from('categories').delete().eq('id', id);
		if (error) throw error;
	},
};
