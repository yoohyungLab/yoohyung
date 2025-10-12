import { notFound } from 'next/navigation';
import { createServerClient } from '@pickid/supabase';
import { CategoryPage } from '@/features/category';

interface PageProps {
	params: Promise<{ slug: string }>;
}

/**
 * 카테고리 페이지 데이터 페칭
 */
async function fetchCategoryData(slug: string) {
	const supabase = createServerClient();

	// 병렬로 데이터 페칭 (성능 최적화)
	const [categoryResult, allCategoriesResult, testsResult] = await Promise.all([
		// 선택된 카테고리 조회
		supabase.from('categories').select('*').eq('slug', slug).eq('status', 'active').single(),

		// 전체 카테고리 조회 (네비게이션용)
		supabase.from('categories').select('*').eq('status', 'active').order('sort_order', { ascending: true }),

		// 해당 카테고리의 테스트 조회 (published만)
		supabase
			.from('tests')
			.select('id,title,description,thumbnail_url,created_at,start_count,response_count,category_ids')
			.eq('status', 'published')
			.contains('category_ids', [slug]), // slug로 먼저 시도
	]);

	// 카테고리가 없으면 404
	if (categoryResult.error || !categoryResult.data) {
		notFound();
	}

	const category = categoryResult.data;

	// 카테고리 ID로 테스트 재조회 (slug로 찾지 못한 경우)
	let tests = testsResult.data || [];
	if (tests.length === 0) {
		const { data: testsByCategoryId } = await supabase
			.from('tests')
			.select('id,title,description,thumbnail_url,created_at,start_count,response_count,category_ids')
			.eq('status', 'published')
			.contains('category_ids', [category.id]);
		tests = testsByCategoryId || [];
	}

	return {
		category,
		allCategories: allCategoriesResult.data || [],
		tests,
	};
}

/**
 * 테스트 데이터를 CategoryPage에서 기대하는 형태로 변환
 */
function transformTestData(
	tests: Array<{
		id: string;
		title: string;
		description: string | null;
		thumbnail_url: string | null;
		created_at: string;
		start_count: number | null;
		response_count: number | null;
	}>
) {
	return tests.map((test) => ({
		id: test.id,
		title: test.title,
		description: test.description || '',
		thumbnail_url: test.thumbnail_url || null,
		thumbnailUrl: test.thumbnail_url || null,
		created_at: test.created_at,
		completions: test.response_count || 0,
		starts: test.start_count || 0,
	}));
}

export default async function CategorySlugPage({ params }: PageProps) {
	const { slug } = await params;

	// 데이터 페칭
	const { allCategories, tests } = await fetchCategoryData(slug);

	// 테스트 데이터 변환
	const transformedTests = transformTestData(tests);

	return <CategoryPage tests={transformedTests} allCategories={allCategories} />;
}
