import { supabase } from '@pickid/supabase';
import type { PopularTest } from '@pickid/supabase';

// 캐시를 위한 Map
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2분

const getCachedData = (key: string) => {
	const cached = cache.get(key);
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached.data;
	}
	return null;
};

const setCachedData = (key: string, data: unknown) => {
	cache.set(key, { data, timestamp: Date.now() });
};

export const dashboardService = {
	async getTopTestsToday(limit: number = 3): Promise<PopularTest[]> {
		const cacheKey = `top_tests_${limit}`;
		const cachedData = getCachedData(cacheKey);
		if (cachedData) {
			return cachedData as PopularTest[];
		}

		// 오늘 날짜 범위 설정
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		// 오늘의 응답 수가 많은 테스트 조회 (간단한 방식)
		const { data: responsesData, error: responsesError } = await supabase
			.from('user_test_responses')
			.select('test_id')
			.gte('created_at', today.toISOString())
			.lt('created_at', tomorrow.toISOString());

		if (responsesError) {
			throw new Error(`인기 테스트 조회 실패: ${responsesError.message}`);
		}

		// 테스트별 응답 수 집계
		const testCounts: Record<string, number> = {};
		(responsesData || []).forEach((response: { test_id: string | null }) => {
			const testId = response.test_id;
			if (testId) {
				testCounts[testId] = (testCounts[testId] || 0) + 1;
			}
		});

		// 상위 N개 테스트 ID 가져오기
		const topTestIds = Object.entries(testCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, limit)
			.map(([testId]) => testId);

		if (topTestIds.length === 0) {
			setCachedData(cacheKey, []);
			return [];
		}

		// 테스트 정보 조회
		const { data: testsData, error: testsError } = await supabase
			.from('tests')
			.select('id, title, slug, status')
			.in('id', topTestIds)
			.eq('status', 'published');

		if (testsError) {
			throw new Error(`테스트 정보 조회 실패: ${testsError.message}`);
		}

		// 결과 생성
		const result: PopularTest[] = (testsData || []).map((test) => ({
			id: test.id,
			title: test.title,
			slug: test.slug,
			thumbnail_url: '',
			type: 'psychology',
			response_count: testCounts[test.id] || 0,
			start_count: 0,
		}));

		setCachedData(cacheKey, result);
		return result;
	},
};
