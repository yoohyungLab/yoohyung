// dashboardService.ts
import { supabase } from '@repo/shared';
import type { DashboardOverviewStats, TestDetailedStats, PopularTest } from '@repo/supabase';

// 캐시를 위한 Map
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2분 (대시보드는 더 자주 업데이트)

// 캐시 유틸리티 함수
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

// TODO: Supabase에서 정의되지 않은 타입들 - 추후 RPC 함수로 대체 예정
export interface DashboardAlert {
	id: string;
	type: 'error' | 'warning' | 'success';
	title: string;
	message: string;
	actionUrl?: string;
	actionText?: string;
	createdAt: string;
}

class DashboardService {
	/**
	 * 대시보드 핵심 통계 조회
	 */
	async getDashboardStats(): Promise<DashboardOverviewStats> {
		const cacheKey = 'dashboard_stats';
		const cachedData = getCachedData(cacheKey);
		if (cachedData) {
			return cachedData as DashboardOverviewStats;
		}

		try {
			const { data, error } = await supabase.rpc('get_dashboard_overview_stats');

			if (error) {
				console.error('대시보드 통계 조회 실패:', error);
				throw new Error('대시보드 통계를 불러올 수 없습니다.');
			}

			const result = data as DashboardOverviewStats;
			setCachedData(cacheKey, result);
			return result;
		} catch (error) {
			console.error('Error in getDashboardStats:', error);
			// 에러 발생 시 기본값 반환
			return {
				total: 0,
				published: 0,
				draft: 0,
				scheduled: 0,
				totalResponses: 0,
				totalCompletions: 0,
				completionRate: 0,
				avgCompletionTime: 0,
				anomalies: 0,
			};
		}
	}

	/**
	 * 오늘의 인기 테스트 TOP N 조회
	 */
	async getTopTestsToday(limit: number = 3): Promise<PopularTest[]> {
		const cacheKey = `top_tests_${limit}`;
		const cachedData = getCachedData(cacheKey);
		if (cachedData) {
			return cachedData as PopularTest[];
		}

		try {
			const { data, error } = await supabase.rpc('get_popular_tests', {
				limit_count: limit,
			});

			if (error) {
				console.error('인기 테스트 조회 실패:', error);
				throw new Error('인기 테스트를 불러올 수 없습니다.');
			}

			const result = data || [];
			setCachedData(cacheKey, result);
			return result;
		} catch (error) {
			console.error('Error in getTopTestsToday:', error);
			return [];
		}
	}

	/**
	 * 대시보드 알림 조회
	 */
	async getDashboardAlerts(): Promise<DashboardAlert[]> {
		const cacheKey = 'dashboard_alerts';
		const cachedData = getCachedData(cacheKey);
		if (cachedData) {
			return cachedData as DashboardAlert[];
		}

		try {
			const { data, error } = await supabase.rpc('get_dashboard_alerts');

			if (error) {
				console.error('알림 조회 실패:', error);
				throw new Error('알림을 불러올 수 없습니다.');
			}

			const result = data || [];
			setCachedData(cacheKey, result);
			return result;
		} catch (error) {
			console.error('Error in getDashboardAlerts:', error);
			return [];
		}
	}

	/**
	 * 특정 테스트의 상세 통계
	 */
	async getTestDetailStats(testId: string): Promise<TestDetailedStats> {
		const { data, error } = await supabase.rpc('get_test_detailed_stats', {
			test_uuid: testId,
		});

		if (error) {
			console.error('테스트 상세 통계 조회 실패:', error);
			throw new Error('테스트 통계를 불러올 수 없습니다.');
		}

		return data as TestDetailedStats;
	}

	/**
	 * 디바이스별 분석
	 */
	private async getDeviceBreakdown(testId: string) {
		const { data, error } = await supabase
			.from('user_test_responses')
			.select('device_type')
			.eq('test_id', testId)
			.not('device_type', 'is', null);

		if (error) {
			console.error('디바이스 분석 실패:', error);
			return { mobile: 0, desktop: 0, tablet: 0 };
		}

		const breakdown = { mobile: 0, desktop: 0, tablet: 0 };
		data.forEach((row: any) => {
			const device = row.device_type?.toLowerCase() || 'desktop';
			if (device.includes('mobile') || device.includes('phone')) {
				breakdown.mobile++;
			} else if (device.includes('tablet') || device.includes('ipad')) {
				breakdown.tablet++;
			} else {
				breakdown.desktop++;
			}
		});

		return breakdown;
	}

	/**
	 * 평균 완료 시간 계산
	 */
	private async getAverageCompletionTime(testId: string): Promise<number> {
		const { data, error } = await supabase
			.from('user_test_responses')
			.select('completion_time_seconds')
			.eq('test_id', testId)
			.not('completion_time_seconds', 'is', null);

		if (error || !data.length) {
			return 0;
		}

		const totalTime = data.reduce((sum: number, row: any) => sum + (row.completion_time_seconds || 0), 0);
		return Math.round(totalTime / data.length);
	}

	/**
	 * 실시간 통계 조회 (최근 1시간)
	 */
	async getRealtimeStats() {
		const oneHourAgo = new Date();
		oneHourAgo.setHours(oneHourAgo.getHours() - 1);

		const { data, error } = await supabase
			.from('user_test_responses')
			.select('id, test_id, created_at, completed_at, session_id')
			.gte('created_at', oneHourAgo.toISOString());

		if (error) {
			console.error('실시간 통계 조회 실패:', error);
			return {
				recentResponses: 0,
				activeUsers: 0,
				completionRate: 0,
			};
		}

		const uniqueUsers = new Set(data.map((r: any) => r.session_id)).size;
		const completedResponses = data.filter((r: any) => r.completed_at).length;
		const completionRate = data.length > 0 ? (completedResponses / data.length) * 100 : 0;

		return {
			recentResponses: data.length,
			activeUsers: uniqueUsers,
			completionRate: Math.round(completionRate),
		};
	}

	/**
	 * 주간 트렌드 데이터 조회
	 */
	async getWeeklyTrends() {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const { data, error } = await supabase
			.from('user_test_responses')
			.select('created_date')
			.gte('created_at', sevenDaysAgo.toISOString());

		if (error) {
			console.error('주간 트렌드 조회 실패:', error);
			return [];
		}

		// 날짜별 응답 수 집계
		const dailyCount: Record<string, number> = {};
		data.forEach((row: any) => {
			const date = row.created_date || new Date(row.created_at).toISOString().split('T')[0];
			dailyCount[date] = (dailyCount[date] || 0) + 1;
		});

		// 지난 7일간 배열 생성
		const trends = [];
		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const dateStr = date.toISOString().split('T')[0];
			trends.push({
				date: dateStr,
				count: dailyCount[dateStr] || 0,
			});
		}

		return trends;
	}

	/**
	 * 캐시 무효화
	 */
	invalidateCache(pattern?: string) {
		if (pattern) {
			// 특정 패턴의 캐시만 무효화
			for (const key of cache.keys()) {
				if (key.includes(pattern)) {
					cache.delete(key);
				}
			}
		} else {
			// 모든 캐시 무효화
			cache.clear();
		}
	}

	/**
	 * 캐시 상태 조회
	 */
	getCacheInfo() {
		return {
			size: cache.size,
			keys: Array.from(cache.keys()),
			entries: Array.from(cache.entries()).map(([key, value]) => ({
				key,
				age: Date.now() - value.timestamp,
				expiresIn: CACHE_DURATION - (Date.now() - value.timestamp),
			})),
		};
	}

	/**
	 * 대시보드 전체 데이터 한번에 조회 (성능 최적화)
	 */
	async getDashboardOverview() {
		const cacheKey = 'dashboard_overview';
		const cachedData = getCachedData(cacheKey);
		if (cachedData) {
			return cachedData;
		}

		try {
			const [stats, alerts, topTests, realtimeStats, weeklyTrends] = await Promise.all([
				this.getDashboardStats(),
				this.getDashboardAlerts(),
				this.getTopTestsToday(3),
				this.getRealtimeStats(),
				this.getWeeklyTrends(),
			]);

			const result = {
				stats,
				alerts,
				topTests,
				realtimeStats,
				weeklyTrends,
				lastUpdated: new Date(),
			};

			setCachedData(cacheKey, result);
			return result;
		} catch (error) {
			console.error('Error in getDashboardOverview:', error);
			throw error;
		}
	}
}

export const dashboardService = new DashboardService();
