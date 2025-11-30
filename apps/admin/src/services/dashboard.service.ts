import { supabase } from '@pickid/supabase';
import type { PopularTest } from '@pickid/supabase';

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000;

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

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const { data: responsesData, error: responsesError } = await supabase
			.from('user_test_responses')
			.select('test_id')
			.gte('created_at', today.toISOString())
			.lt('created_at', tomorrow.toISOString());

		if (responsesError) {
			throw new Error(`인기 테스트 조회 실패: ${responsesError.message}`);
		}

		const testCounts: Record<string, number> = {};
		(responsesData || []).forEach((response: { test_id: string | null }) => {
			const testId = response.test_id;
			if (testId) {
				testCounts[testId] = (testCounts[testId] || 0) + 1;
			}
		});

		const topTestIds = Object.entries(testCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, limit)
			.map(([testId]) => testId);

		if (topTestIds.length === 0) {
			setCachedData(cacheKey, []);
			return [];
		}

		const { data: testsData, error: testsError } = await supabase
			.from('tests')
			.select('id, title, slug, status')
			.in('id', topTestIds)
			.eq('status', 'published');

		if (testsError) {
			throw new Error(`테스트 정보 조회 실패: ${testsError.message}`);
		}

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
