import { createServerClient, supabase } from '@pickid/supabase';
import type { PopularPageData, Test, Category } from '@pickid/supabase';

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

export const popularService = {
	getClient() {
		return typeof window === 'undefined' ? createServerClient() : supabase;
	},

	async getPopularPageData(): Promise<PopularPageData> {
		try {
			const client = this.getClient();

			const [{ data: tests, error: testsError }, { data: allCategories, error: categoriesError }] = await Promise.all([
				client.from('tests').select('*').eq('status', 'published').order('response_count', { ascending: false }).limit(50),
				client.from('categories').select('*').eq('status', 'active').order('sort_order', { ascending: true }),
			]);

			if (testsError) throw testsError;
			if (categoriesError) throw categoriesError;

			const mappedTests = (tests as Test[] || []).map((t) => ({
				id: t.id,
				title: t.title,
				description: t.description || '',
				thumbnail_url: t.thumbnail_url || '/images/placeholder.svg',
				thumbnailUrl: t.thumbnail_url || '/images/placeholder.svg',
				created_at: t.created_at,
				category_ids: t.category_ids || null,
				completions: t.response_count || 0,
				starts: t.start_count || 0,
			}));

			return { tests: mappedTests, categories: (allCategories as Category[]) || [] };
		} catch (error) {
			handleSupabaseError(error, 'getPopularPageData');
			throw error;
		}
	},
};
