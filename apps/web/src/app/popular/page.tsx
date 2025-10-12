import { supabase } from '@pickid/supabase';
import { CategoryPage } from '@/features/category/ui/category-page';
import type { Category } from '@pickid/supabase';

export default async function PopularPage() {
	// 인기 테스트 조회 (전체 테스트 중 완료 횟수 기준 상위)
	const { data: tests } = await supabase
		.from('tests')
		.select('id,title,description,thumbnail_url,created_at,start_count,response_count,category_ids')
		.eq('status', 'published')
		.order('response_count', { ascending: false })
		.limit(50); // 상위 50개만

	// 전체 카테고리 조회 (네비게이션용)
	const { data: allCategories } = await supabase
		.from('categories')
		.select('*')
		.eq('status', 'active')
		.order('sort_order', { ascending: true });

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

	// 가상의 "인기 테스트" 카테고리 생성
	const popularCategory: Category = {
		id: 'popular',
		name: '🔥 요즘 인기 테스트',
		slug: 'popular',
		sort_order: 0,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		status: 'active',
		banner_url: null,
		description: null,
		icon_url: null,
		thumbnail_url: null,
	};

	return (
		<CategoryPage
			category={popularCategory as Category}
			tests={mappedTests}
			allCategories={(allCategories || []) as Category[]}
		/>
	);
}
