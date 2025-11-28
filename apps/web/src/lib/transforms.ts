import type { Category, Test, TestCard } from '@pickid/supabase';

// 데이터 변환 유틸리티
// 서비스에서 가져온 원시 데이터를 UI용 데이터로 변환

// 카테고리 ID를 카테고리 이름 배열로 변환
export function getCategoryNames(categoryIds: string[] | null, categories: Category[]): string[] {
	if (!categoryIds || categoryIds.length === 0) return ['미분류'];

	const categoryNames = categoryIds
		.map((id) => categories.find((cat) => cat.id === id)?.name || '알 수 없음')
		.filter((name) => name !== '알 수 없음');

	return categoryNames.length > 0 ? categoryNames : ['미분류'];
}

// Test 데이터를 TestCard 형식으로 변환
export function transformToTestCard(test: Test, categories: Category[]): TestCard {
	return {
		id: test.id,
		title: test.title,
		description: test.description || '',
		image: test.thumbnail_url || '/images/placeholder.svg',
		tags: getCategoryNames(test.category_ids, categories),
		type: test.type,
		status: test.status,
		slug: test.slug,
		category_ids: test.category_ids,
		thumbnail_url: test.thumbnail_url,
		starts: test.start_count,
		completions: test.response_count,
	};
}

// 테스트 배열을 TestCard 배열로 일괄 변환
export function transformTestsToCards(tests: Test[], categories: Category[]): TestCard[] {
	return tests.map((test) => transformToTestCard(test, categories));
}
