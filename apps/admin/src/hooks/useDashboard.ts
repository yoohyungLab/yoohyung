import { useState, useCallback, useEffect, useMemo } from 'react';
import { dashboardService } from '@/shared/api';
import type { DashboardOverviewStats, TestDetailedStats, PopularTest } from '@repo/supabase';

interface DashboardState {
	stats: DashboardOverviewStats | null;
	alerts: any[]; // TODO: DashboardAlert 타입 정의 필요
	topTests: PopularTest[];
	loading: boolean;
	error: string | null;
	lastUpdated: Date;
}

interface RealtimeStats {
	recentResponses: number;
	activeUsers: number;
	completionRate: number;
}

export const useDashboard = () => {
	const [state, setState] = useState<DashboardState>({
		stats: null,
		alerts: [],
		topTests: [],
		loading: false,
		error: null,
		lastUpdated: new Date(),
	});

	const [realtimeStats, setRealtimeStats] = useState<RealtimeStats | null>(null);

	// 통계 계산 (메모화)
	const computedStats = useMemo(() => {
		if (!state.stats) {
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

		return {
			...state.stats,
			// 추가 계산된 통계들
			responseGrowthRate: state.stats.totalResponses > 0 ? '+' : state.stats.totalResponses < 0 ? '-' : '=',
			visitorGrowthRate: state.stats.totalCompletions > 0 ? '+' : state.stats.totalCompletions < 0 ? '-' : '=',
		};
	}, [state.stats]);

	// 데이터 로딩
	const loadDashboardData = useCallback(async () => {
		setState((prev) => ({ ...prev, loading: true, error: null }));

		try {
			const [stats, alerts, topTests] = await Promise.all([
				dashboardService.getDashboardStats(),
				dashboardService.getDashboardAlerts(),
				dashboardService.getTopTestsToday(3),
			]);

			setState((prev) => ({
				...prev,
				stats,
				alerts,
				topTests,
				loading: false,
				lastUpdated: new Date(),
			}));
		} catch (error) {
			console.error('대시보드 데이터 로딩 실패:', error);
			setState((prev) => ({
				...prev,
				loading: false,
				error: error instanceof Error ? error.message : '대시보드 데이터를 불러오는데 실패했습니다.',
			}));
		}
	}, []);

	// 실시간 통계 로딩
	const loadRealtimeStats = useCallback(async () => {
		try {
			const stats = await dashboardService.getRealtimeStats();
			setRealtimeStats(stats);
		} catch (error) {
			console.error('실시간 통계 로딩 실패:', error);
		}
	}, []);

	// 특정 테스트 상세 통계 로딩
	const loadTestDetailStats = useCallback(async (testId: string): Promise<TestDetailStats | null> => {
		try {
			const stats = await dashboardService.getTestDetailStats(testId);
			return stats;
		} catch (error) {
			console.error('테스트 상세 통계 로딩 실패:', error);
			return null;
		}
	}, []);

	// 알림 필터링
	const getAlertsByType = useCallback(
		(type: 'error' | 'warning' | 'success') => {
			return state.alerts.filter((alert) => alert.type === type);
		},
		[state.alerts]
	);

	// 인기 테스트 정렬
	const getTopTestsByGrowth = useCallback(() => {
		return [...state.topTests].sort((a, b) => b.response_count - a.response_count);
	}, [state.topTests]);

	// 인기 테스트 정렬 (응답수 기준)
	const getTopTestsByResponses = useCallback(() => {
		return [...state.topTests].sort((a, b) => b.response_count - a.response_count);
	}, [state.topTests]);

	// 초기 로딩
	useEffect(() => {
		loadDashboardData();
		loadRealtimeStats();
	}, [loadDashboardData, loadRealtimeStats]);

	// 실시간 업데이트 (5분마다)
	useEffect(() => {
		const interval = setInterval(() => {
			loadRealtimeStats();
		}, 5 * 60 * 1000); // 5분

		return () => clearInterval(interval);
	}, [loadRealtimeStats]);

	return {
		// 상태
		stats: computedStats,
		alerts: state.alerts,
		topTests: state.topTests,
		realtimeStats,
		loading: state.loading,
		error: state.error,
		lastUpdated: state.lastUpdated,

		// 액션들
		loadDashboardData,
		loadRealtimeStats,
		loadTestDetailStats,

		// 유틸리티 함수들
		getAlertsByType,
		getTopTestsByGrowth,
		getTopTestsByResponses,
	};
};
