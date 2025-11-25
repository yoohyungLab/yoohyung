import { createServerClient, supabase } from '@pickid/supabase';
import type { Test, Category } from '@pickid/supabase';

// Type re-exports
export type { Test, Category };

export const popularService = {
	getClient() {
		return typeof window === 'undefined' ? createServerClient() : supabase;
	},

	async getPopularPageData(): Promise<{ tests: Test[]; categories: Category[] }> {
		const client = this.getClient();

		const [{ data: tests, error: testsError }, { data: categories, error: categoriesError }] = await Promise.all([
			client.from('tests').select('*').eq('status', 'published').order('response_count', { ascending: false }).limit(50),
			client.from('categories').select('*').eq('status', 'active').order('sort_order', { ascending: true }),
		]);

		if (testsError) throw testsError;
		if (categoriesError) throw categoriesError;

		return {
			tests: (tests as Test[]) || [],
			categories: (categories as Category[]) || [],
		};
	},
};
