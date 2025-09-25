import { useState, useEffect, useCallback } from 'react';
import { dashboardService, type DashboardStats, type TopTest, type DashboardAlert } from '@/shared/api';

export function useDashboard() {
	const [stats, setStats] = useState<DashboardStats>({
		totalTests: 0,
		publishedTests: 0,
		todayResponses: 0,
		weeklyResponses: 0,
		todayVisitors: 0,
		weeklyCompletionRate: 0,
		responseGrowth: 0,
		visitorGrowth: 0,
	});

	const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
	const [topTests, setTopTests] = useState<TopTest[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

	const loadDashboardData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// 병렬로 모든 데이터 로드
			const [statsData, alertsData, topTestsData] = await Promise.all([
				dashboardService.getDashboardStats(),
				dashboardService.getDashboardAlerts(),
				dashboardService.getTopTestsToday(3),
			]);

			setStats(statsData);
			setAlerts(alertsData);
			setTopTests(topTestsData);
			setLastUpdated(new Date());
		} catch (err) {
			console.error('대시보드 데이터 로드 오류:', err);
			setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
		} finally {
			setLoading(false);
		}
	}, []);

	// 초기 로드
	useEffect(() => {
		loadDashboardData();
	}, [loadDashboardData]);

	// 10분마다 자동 새로고침
	useEffect(() => {
		const interval = setInterval(loadDashboardData, 10 * 60 * 1000);
		return () => clearInterval(interval);
	}, [loadDashboardData]);

	// 수동 새로고침
	const refresh = useCallback(() => {
		loadDashboardData();
	}, [loadDashboardData]);

	return {
		stats,
		alerts,
		topTests,
		loading,
		error,
		lastUpdated,
		refresh,
	};
}
