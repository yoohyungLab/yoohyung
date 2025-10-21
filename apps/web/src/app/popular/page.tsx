import { Metadata } from 'next';
import { supabase } from '@pickid/supabase';
import { CategoryContainer } from '@/features/category/ui/category-container';
import { generatePageMetadata } from '@/shared/lib/metadata';
import type { Category } from '@pickid/supabase';

export const metadata: Metadata = generatePageMetadata({
	title: '인기 테스트',
	description: '지금 가장 많이 하는 심리테스트! 인기 테스트 TOP 50을 만나보세요.',
	path: '/popular',
});

export default async function PopularPage() {
	const { data: tests } = await supabase
		.from('tests')
		.select('id,title,description,thumbnail_url,created_at,start_count,response_count,category_ids')
		.eq('status', 'published')
		.order('response_count', { ascending: false })
		.limit(50);

	const { data: allCategories } = await supabase
		.from('categories')
		.select('*')
		.eq('status', 'active')
		.order('sort_order', { ascending: true });

	const mappedTests = (tests || []).map((t) => ({
		id: t.id,
		title: t.title,
		description: t.description || '',
		thumbnail_url: t.thumbnail_url || '/images/placeholder.svg',
		thumbnailUrl: t.thumbnail_url || '/images/placeholder.svg',
		created_at: t.created_at,
		completions: t.response_count || 0,
		starts: t.start_count || 0,
		category_ids: t.category_ids || undefined,
	}));

	return <CategoryContainer allTests={mappedTests} allCategories={(allCategories || []) as Category[]} />;
}
