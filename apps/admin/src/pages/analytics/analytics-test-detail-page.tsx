import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyticsService } from '@/services';
import { ErrorState } from '@pickid/ui';
import { LoadingState } from '@/components/ui';
import {
	AnalyticsHeader,
	AnalyticsStatsCards,
	AnalyticsTabs,
	OverviewTab,
	FunnelTab,
	TrendsTab,
} from '@/components/analytics';
import type { Test, Database } from '@pickid/supabase';

// Supabase 함수 반환 타입들
type TestBasicStats = Database['public']['Functions']['get_test_basic_stats']['Returns'];
type TestAnalyticsData = Database['public']['Functions']['get_test_analytics_data']['Returns'];

// 질문별 성과분석 데이터 타입
type FunnelDataItem = {
	questionId: string;
	question: string;
	reached: number;
	completed: number;
	dropoff: number;
	avgTime: number;
	order: number;
};

export function AnalyticsTestDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [test, setTest] = useState<Test | null>(null);
	const [loading, setLoading] = useState(false);
	const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
	const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'funnel'>('overview');

	// 데이터 상태들
	const [basicStats, setBasicStats] = useState<TestBasicStats | null>(null);
	const [testData, setTestData] = useState<TestAnalyticsData | null>(null);
	const [funnelData, setFunnelData] = useState<FunnelDataItem[]>([]);
	const [dataLoaded, setDataLoaded] = useState(false);

	// 모든 데이터 로딩
	const loadAllData = useCallback(async () => {
		if (!id) return;

		setLoading(true);
		setDataLoaded(false);
		try {
			// 병렬로 핵심 데이터만 로딩
			const [testList, basicStatsData, analyticsData, funnelDataResult] = await Promise.all([
				analyticsService.getAllTestsForAnalytics(),
				analyticsService.getTestBasicStats(id),
				analyticsService.getTestAnalyticsData(id),
				analyticsService.getTestFunnelData(id),
			]);

			// 테스트 정보 설정
			const foundTest = testList.find((t) => t.id === id);
			if (foundTest) {
				setTest(foundTest);
			} else {
				navigate('/analytics');
				return;
			}

			// 데이터 설정
			setBasicStats(basicStatsData);
			setTestData(analyticsData);
			setFunnelData(funnelDataResult);
			setDataLoaded(true);
		} catch (error) {
			console.error('데이터 로딩 실패:', error);
			// 에러 발생 시 기본값 설정
			setBasicStats({
				responses: 0,
				completions: 0,
				completionRate: 0,
				avgTime: 0,
				avgScore: 0,
				deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
			});
			setDataLoaded(true);
		} finally {
			setLoading(false);
		}
	}, [id, navigate]);

	// 초기 데이터 로딩
	useEffect(() => {
		loadAllData();
	}, [loadAllData]);

	// 시간 범위 변경 시 데이터 다시 로딩
	useEffect(() => {
		loadAllData();
	}, [timeRange, loadAllData]);

	if (loading) {
		return (
			<div className="space-y-6 p-6">
				<LoadingState message="테스트 데이터를 불러오는 중..." />
			</div>
		);
	}

	if (!test) {
		return (
			<div className="space-y-6 p-6">
				<ErrorState
					title="테스트를 찾을 수 없습니다"
					message="요청하신 테스트가 존재하지 않거나 삭제되었습니다."
					actionLabel="분석 목록으로 돌아가기"
					onAction={() => navigate('/analytics')}
				/>
			</div>
		);
	}

	if (!dataLoaded) {
		return (
			<div className="space-y-6 p-6">
				<LoadingState message="데이터를 불러오는 중..." />
			</div>
		);
	}

	return (
		<div className="space-y-6 p-6">
			<AnalyticsHeader
				test={test}
				timeRange={timeRange}
				loading={loading}
				onTimeRangeChange={setTimeRange}
				onBack={() => navigate('/analytics')}
			/>

			<AnalyticsStatsCards basicStats={basicStats} />

			<AnalyticsTabs activeTab={activeTab} onTabChange={setActiveTab} />

			{activeTab === 'overview' && <OverviewTab testData={testData} completions={basicStats?.completions || 0} />}

			{activeTab === 'funnel' && <FunnelTab funnelData={funnelData} />}

			{activeTab === 'trends' && <TrendsTab testData={testData} />}
		</div>
	);
}
