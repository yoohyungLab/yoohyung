import { useState, useCallback, useEffect, useMemo } from 'react';
import { analyticsService } from '@/shared/api';
import type { Test, DashboardOverviewStats } from '@repo/supabase';

// 분석용 테스트 타입 (평균 소요시간 포함)
type TestWithAnalytics = Test & {
	avg_completion_time?: number;
};

interface AnalyticsFilters {
	search?: string;
	status?: 'all' | 'published' | 'draft' | 'scheduled';
	category?: 'all' | 'personality' | 'career' | 'relationship';
	timeRange?: 'today' | '7d' | '30d' | 'custom';
}

interface AnalyticsStats {
	total: number;
	published: number;
	draft: number;
	scheduled: number;
	totalResponses: number;
	totalCompletions: number;
	completionRate: number;
	avgCompletionTime: number;
	anomalies: number;
}

export const useAnalytics = () => {
	const [tests, setTests] = useState<TestWithAnalytics[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedTests, setSelectedTests] = useState<string[]>([]);
	const [totalTests, setTotalTests] = useState(0);
	const [filters, setFilters] = useState<AnalyticsFilters>({
		search: '',
		status: 'all',
		category: 'all',
		timeRange: '7d',
	});

	// 통계 데이터
	const [stats, setStats] = useState<AnalyticsStats>({
		total: 0,
		published: 0,
		draft: 0,
		scheduled: 0,
		totalResponses: 0,
		totalCompletions: 0,
		completionRate: 0,
		avgCompletionTime: 0,
		anomalies: 0,
	});

	// 필터링된 테스트 목록
	const filteredTests = useMemo(() => {
		return tests.filter((test) => {
			const matchesSearch =
				!filters.search ||
				test.title.toLowerCase().includes(filters.search.toLowerCase()) ||
				test.description?.toLowerCase().includes(filters.search.toLowerCase());

			const matchesStatus = filters.status === 'all' || test.status === filters.status;

			// 카테고리 필터링은 실제 구현에 따라 조정 필요
			const matchesCategory = filters.category === 'all';

			return matchesSearch && matchesStatus && matchesCategory;
		});
	}, [tests, filters]);

	// 데이터 로딩
	const loadData = useCallback(async (includeStats = false) => {
		setLoading(true);
		setError(null);

		try {
			const [testList, statsData] = await Promise.all([
				analyticsService.getAllTestsForAnalytics(),
				includeStats ? analyticsService.getDashboardOverviewStats() : null,
			]);

			setTests(testList);
			setTotalTests(testList.length);

			// 실제 통계 데이터 사용
			if (statsData) {
				setStats({
					total: statsData.total,
					published: statsData.published,
					draft: statsData.draft,
					scheduled: statsData.scheduled,
					totalResponses: statsData.totalResponses,
					totalCompletions: statsData.totalCompletions,
					completionRate: statsData.completionRate,
					avgCompletionTime: statsData.avgCompletionTime,
					anomalies: statsData.anomalies,
				});
			}
		} catch (error) {
			console.error('데이터 로딩 실패:', error);
			// 에러 발생 시에도 기본값으로 설정하여 UI가 깨지지 않도록 함
			setStats({
				total: 0,
				published: 0,
				draft: 0,
				scheduled: 0,
				totalResponses: 0,
				totalCompletions: 0,
				completionRate: 0,
				avgCompletionTime: 0,
				anomalies: 0,
			});
			setError(null); // 에러 상태를 초기화하여 정상 UI 표시
		} finally {
			setLoading(false);
		}
	}, []);

	// 필터 변경 시 데이터 로딩 (디바운싱 적용)
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			loadData(true);
		}, 300); // 300ms 디바운싱

		return () => clearTimeout(timeoutId);
	}, [filters.search, filters.status, filters.category, filters.timeRange, loadData]);

	// 초기 로딩
	useEffect(() => {
		loadData(true);
	}, [loadData]);

	const handleExport = useCallback(async () => {
		try {
			console.log('Exporting data...');
			// 실제 내보내기 로직 구현
		} catch (error) {
			console.error('내보내기 실패:', error);
		}
	}, []);

	const handleBulkAction = useCallback(
		async (action: string) => {
			if (selectedTests.length === 0) return;
			console.log(`Bulk action: ${action}`, selectedTests);
			setSelectedTests([]);
		},
		[selectedTests]
	);

	// 필터 업데이트
	const updateFilters = useCallback((newFilters: Partial<AnalyticsFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	// 선택된 테스트 관리
	const updateSelectedTests = useCallback((testIds: string[]) => {
		setSelectedTests(testIds);
	}, []);

	const clearSelectedTests = useCallback(() => {
		setSelectedTests([]);
	}, []);

	return {
		// 데이터
		tests: filteredTests,
		loading,
		error,
		selectedTests,
		totalTests,
		filters,
		stats,

		// 액션들
		loadData,
		handleExport,
		handleBulkAction,
		updateFilters,
		updateSelectedTests,
		clearSelectedTests,
	};
};
