import { dashboardService } from '@/shared/api';
import type { PopularTest } from '@/shared/api/services/dashboard.service';
import type { DashboardOverviewStats } from '@repo/supabase';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface DashboardState {
	stats: DashboardOverviewStats | null;
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
				totalTests: 0,
				publishedTests: 0,
				draftTests: 0,
				scheduledTests: 0,
				todayResponses: 0,
				todayVisitors: 0,
				weeklyCompletionRate: 0,
				responseGrowth: 'up' as const,
				visitorGrowth: 'up' as const,
			};
		}

		return {
			// 대시보드 페이지에서 사용하는 필드명으로 매핑
			totalTests: state.stats.total,
			publishedTests: state.stats.published,
			draftTests: state.stats.draft,
			scheduledTests: state.stats.scheduled,
			todayResponses: state.stats.totalResponses,
			todayVisitors: state.stats.totalCompletions,
			weeklyCompletionRate: state.stats.completionRate,
			responseGrowth: state.stats.totalResponses > 0 ? ('up' as const) : ('down' as const),
			visitorGrowth: state.stats.totalCompletions > 0 ? ('up' as const) : ('down' as const),
		};
	}, [state.stats]);

	// 데이터 로딩
	const loadDashboardData = useCallback(async () => {
		setState((prev) => ({ ...prev, loading: true, error: null }));

		try {
			const [stats, topTests] = await Promise.all([
				dashboardService.getDashboardStats(),
				dashboardService.getTopTestsToday(3),
			]);

			setState((prev) => ({
				...prev,
				stats,
				topTests,
				alerts: [], // 빈 배열로 설정
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
		getTopTestsByGrowth,
		getTopTestsByResponses,
	};
};
