// dashboardService.ts
import { supabase } from '@repo/shared';

export interface DashboardStats {
	totalTests: number;
	publishedTests: number;
	todayResponses: number;
	weeklyResponses: number;
	todayVisitors: number;
	weeklyCompletionRate: number;
	responseGrowth: number;
	visitorGrowth: number;
}

export interface TopTest {
	id: string;
	title: string;
	type: 'psychology' | 'quiz';
	emoji: string;
	todayResponses: number;
	conversionRate: number;
	trend: 'up' | 'down' | 'stable';
	responseGrowth: number;
}

export interface DashboardAlert {
	id: string;
	type: 'error' | 'warning' | 'success';
	title: string;
	message: string;
	actionUrl?: string;
	actionText?: string;
	createdAt: string;
}

export interface TestDetailStats {
	totalResponses: number;
	completedResponses: number;
	completionRate: number;
	averageTime?: number;
	deviceBreakdown: {
		mobile: number;
		desktop: number;
		tablet: number;
	};
}

class DashboardService {
	/**
	 * 대시보드 핵심 통계 조회
	 */
	async getDashboardStats(): Promise<DashboardStats> {
		const { data, error } = await supabase.rpc('get_dashboard_stats');

		if (error) {
			console.error('대시보드 통계 조회 실패:', error);
			throw new Error('대시보드 통계를 불러올 수 없습니다.');
		}

		return data;
	}

	/**
	 * 오늘의 인기 테스트 TOP N 조회
	 */
	async getTopTestsToday(limit: number = 3): Promise<TopTest[]> {
		const { data, error } = await supabase.rpc('get_top_tests_today', {
			limit_count: limit,
		});

		if (error) {
			console.error('인기 테스트 조회 실패:', error);
			throw new Error('인기 테스트를 불러올 수 없습니다.');
		}

		return data || [];
	}

	/**
	 * 대시보드 알림 조회
	 */
	async getDashboardAlerts(): Promise<DashboardAlert[]> {
		const { data, error } = await supabase.rpc('get_dashboard_alerts');

		if (error) {
			console.error('알림 조회 실패:', error);
			throw new Error('알림을 불러올 수 없습니다.');
		}

		return data || [];
	}

	/**
	 * 특정 테스트의 상세 통계
	 */
	async getTestDetailStats(testId: string): Promise<TestDetailStats> {
		const { data, error } = await supabase.rpc('get_test_detailed_stats', {
			test_uuid: testId,
		});

		if (error) {
			console.error('테스트 상세 통계 조회 실패:', error);
			throw new Error('테스트 통계를 불러올 수 없습니다.');
		}

		// 추가 통계 계산 (평균 시간, 디바이스 분석)
		const deviceStats = await this.getDeviceBreakdown(testId);
		const avgTime = await this.getAverageCompletionTime(testId);

		return {
			...data,
			averageTime: avgTime,
			deviceBreakdown: deviceStats,
		};
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
		data.forEach((row) => {
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

		const totalTime = data.reduce((sum, row) => sum + (row.completion_time_seconds || 0), 0);
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

		const uniqueUsers = new Set(data.map((r) => r.session_id)).size;
		const completedResponses = data.filter((r) => r.completed_at).length;
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
		data.forEach((row) => {
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
}

export const dashboardService = new DashboardService();
