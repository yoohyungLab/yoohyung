import { createServerClient, supabase } from '@pickid/supabase';
import type { PopularPageData } from '@pickid/supabase';

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
				client
					.from('tests')
					.select('id,title,description,thumbnail_url,created_at,start_count,response_count,category_ids')
					.eq('status', 'published')
					.order('response_count', { ascending: false })
					.limit(50),
				client.from('categories').select('*').eq('status', 'active').order('sort_order', { ascending: true }),
			]);

			if (testsError) throw testsError;
			if (categoriesError) throw categoriesError;

			const mappedTests = (tests || []).map((t) => ({
				id: t.id,
				title: t.title,
				description: t.description || '',
				thumbnail_url: t.thumbnail_url || '/images/placeholder.svg',
				thumbnailUrl: t.thumbnail_url || '/images/placeholder.svg',
				created_at: t.created_at,
				category_ids: (t.category_ids as string[] | null) || null,
				completions: t.response_count || 0,
				starts: t.start_count || 0,
			}));

			return { tests: mappedTests, categories: allCategories || [] };
		} catch (error) {
			handleSupabaseError(error, 'getPopularPageData');
			throw error;
		}
	},
};
