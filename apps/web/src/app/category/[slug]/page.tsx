import { notFound } from 'next/navigation';
import { createServerClient } from '@pickid/supabase';
import type { Category } from '@pickid/supabase';
import { CategoryPage } from '@/features/category/ui/category-page';

interface PageProps {
	params: Promise<{ slug: string }>;
}

export default async function CategorySlugPage({ params }: PageProps) {
	const supabase = createServerClient();
	const { slug } = await params;

	// 선택된 카테고리 조회
	const { data: category, error: categoryError } = await supabase
		.from('categories')
		.select('*')
		.eq('slug', slug)
		.eq('status', 'active')
		.single();

	if (categoryError || !category) {
		notFound();
	}

	// 전체 카테고리(네비용) 조회
	const { data: allCategories } = await supabase
		.from('categories')
		.select('*')
		.eq('status', 'active')
		.order('sort_order', { ascending: true });

	// 해당 카테고리의 테스트 조회 (published만)
	const { data: tests } = await supabase
		.from('tests')
		.select('id,title,description,thumbnail_url,created_at,start_count,response_count,category_ids')
		.eq('status', 'published')
		.contains('category_ids', [category.id]);

	// CategoryPage의 기대 prop 형태로 매핑
	const mappedTests = (tests || []).map((t) => ({
		id: t.id,
		title: t.title,
		description: t.description || '',
		thumbnailUrl: t.thumbnail_url || null,
		completions: t.response_count || 0,
		createdAt: t.created_at,
		starts: t.start_count || 0,
	}));

	return (
		<CategoryPage
			category={category as Category}
			tests={mappedTests}
			allCategories={(allCategories || []) as Category[]}
		/>
	);
}
