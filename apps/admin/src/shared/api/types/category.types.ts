import type { Category } from '@repo/supabase';

export interface CategoryFilters {
	search?: string;
	status?: 'all' | 'active' | 'inactive';
}

export interface CategoryStats {
	total: number;
	active: number;
	inactive: number;
}

export interface AdminCategoryResponse {
	categories: Category[];
	total: number;
	totalPages: number;
	currentPage: number;
}
