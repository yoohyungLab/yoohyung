import { createServerClient } from '@pickid/supabase';
import type { TestCard } from '@/shared/types/home';

/**
 * 홈페이지용 서버 사이드 데이터 페칭 서비스
 * SSR을 위한 서버에서 실행되는 함수들
 */
export const homeService = {
	/**
	 * 홈페이지에 필요한 모든 데이터를 한 번에 가져오기 (프리패치 최적화)
	 * - 테스트 목록
	 * - 카테고리 목록
	 * - 섹션별 정렬된 데이터
	 *
	 * @description 서버에서 병렬로 모든 데이터를 미리 로드하여
	 * 클라이언트의 추가 요청 없이 완성된 페이지 제공
	 */
	async getHomePageData() {
		try {
			// 서버 사이드 Supabase 클라이언트 생성
			const supabase = createServerClient();

			// 병렬로 데이터 가져오기 (프리패치 최적화)
			const [testsData, categoriesData] = await Promise.all([
				supabase.from('tests').select('*').eq('status', 'published').order('created_at', { ascending: false }),
				supabase.from('categories').select('*').eq('status', 'active').order('name'),
			]);

			if (testsData.error) throw testsData.error;
			if (categoriesData.error) throw categoriesData.error;

			const tests = testsData.data || [];
			const categories = categoriesData.data || [];

			// 카테고리 매핑 함수
			const getCategoryNames = (categoryIds: string[] | null): string[] => {
				if (!categoryIds || categoryIds.length === 0) {
					return ['미분류'];
				}

				// PostgreSQL 배열 처리
				let processedCategoryIds = categoryIds;
				if (typeof categoryIds === 'string') {
					try {
						processedCategoryIds = JSON.parse(categoryIds);
					} catch {
						processedCategoryIds = [categoryIds];
					}
				}

				const categoryNames = processedCategoryIds
					.map((categoryId) => {
						const category = categories.find((cat) => cat.id === categoryId);
						return category?.name || '알 수 없음';
					})
					.filter((name) => name !== '알 수 없음');

				return categoryNames.length > 0 ? categoryNames : ['미분류'];
			};

			// 테스트 데이터를 카드 형태로 변환
			const testsAsCards: TestCard[] = tests.map((test) => ({
				id: test.id,
				title: test.title,
				description: test.description || '',
				image: test.thumbnail_url || '/images/egen-teto/thumbnail.png',
				tags: getCategoryNames(test.category_ids),
				type: test.type,
				status: test.status,
				slug: test.slug,
				category_ids: test.category_ids,
				thumbnail_url: test.thumbnail_url,
				view_count: test.view_count,
				response_count: test.response_count,
			}));

			// 인기 테스트 (응답 수 기준)
			const popularTests = [...testsAsCards]
				.sort((a, b) => {
					const testA = tests.find((t) => t.id === a.id);
					const testB = tests.find((t) => t.id === b.id);
					return (testB?.response_count || 0) - (testA?.response_count || 0);
				})
				.slice(0, 6);

			// 추천 테스트 (조회 수 기준)
			const recommendedTests = [...testsAsCards]
				.sort((a, b) => {
					const testA = tests.find((t) => t.id === a.id);
					const testB = tests.find((t) => t.id === b.id);
					return (testB?.view_count || 0) - (testA?.view_count || 0);
				})
				.slice(1, 7);

			// 명예의 전당 (인기 테스트와 동일)
			const topByType = popularTests;

			return {
				tests: testsAsCards,
				categories,
				popularTests,
				recommendedTests,
				topByType,
			};
		} catch (error) {
			console.error('Error fetching home page data:', error);
			// 에러 발생 시 빈 데이터 반환
			return {
				tests: [],
				categories: [],
				popularTests: [],
				recommendedTests: [],
				topByType: [],
			};
		}
	},
};
