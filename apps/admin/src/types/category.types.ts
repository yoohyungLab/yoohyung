import type { CategoryStatus } from '@pickid/supabase';

export interface CategoryFilters {
	search: string;
	status: 'all' | CategoryStatus;
}

export interface ICategoryStats {
	total: number;
	active: number;
	inactive: number;
}