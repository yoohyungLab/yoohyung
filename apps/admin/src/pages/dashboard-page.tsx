import { Card, CardContent, IconButton } from '@repo/ui';
import { LoadingState, ErrorState } from '../components/ui';
import { Activity, BarChart3, FileText, Plus, RefreshCw, Target, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks';
import { KPICard, AlertCard, QuickActionCard, PopularTestsCard } from '../components/dashboard';

export function SimplifiedDashboard() {
	const { stats, alerts, topTests, loading, error, lastUpdated, refresh } = useDashboard();

	// 트렌드 아이콘 렌더링 함수
	const renderTrendIcon = (trend: string) => {
		switch (trend) {
			case 'up':
				return <TrendingUp className="w-4 h-4 text-green-600" />;
			case 'down':
				return <TrendingDown className="w-4 h-4 text-red-600" />;
			default:
				return <Activity className="w-4 h-4 text-gray-600" />;
		}
	};

	if (loading) {
		return <LoadingState message="대시보드를 불러오는 중..." />;
	}

	if (error) {
		return <ErrorState title="데이터를 불러올 수 없습니다" message={error} onRetry={refresh} retryLabel="다시 시도" />;
	}

	return (
		<div className="space-y-6 p-5">
			{/* 헤더 */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
					<p className="text-gray-600 mt-1">오늘의 핵심 지표</p>
					<p className="text-sm text-gray-500 mt-1">업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}</p>
				</div>
				<div className="flex items-center gap-3">
					<IconButton
						variant="outline"
						onClick={refresh}
						disabled={loading}
						icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
						label="새로고침"
					/>
					<Link to="/tests/create">
						<IconButton
							className="bg-blue-600 hover:bg-blue-700 text-white"
							icon={<Plus className="w-4 h-4" />}
							label="테스트 만들기"
						/>
					</Link>
				</div>
			</div>

			{/* 핵심 KPI (4개만) */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<KPICard
					title="활성 테스트"
					value={stats.publishedTests}
					icon={<FileText className="w-6 h-6" />}
					borderColor="border-l-blue-500"
					valueColor="text-blue-600"
					iconColor="text-blue-500"
					subtitle={`총 ${stats.totalTests}개`}
				/>

				<KPICard
					title="오늘 응답"
					value={stats.todayResponses}
					icon={<Target className="w-6 h-6" />}
					borderColor="border-l-green-500"
					valueColor="text-green-600"
					iconColor="text-green-500"
					growth={stats.responseGrowth}
					showGrowth={true}
				/>

				<KPICard
					title="오늘 방문자"
					value={stats.todayVisitors}
					icon={<Users className="w-6 h-6" />}
					borderColor="border-l-purple-500"
					valueColor="text-purple-600"
					iconColor="text-purple-500"
					growth={stats.visitorGrowth}
					showGrowth={true}
				/>

				<KPICard
					title="완료율"
					value={`${stats.weeklyCompletionRate}%`}
					icon={<BarChart3 className="w-6 h-6" />}
					borderColor="border-l-orange-500"
					valueColor="text-orange-600"
					iconColor="text-orange-500"
					subtitle="이번 주 평균"
				/>
			</div>

			{/* 알림 영역 (간소화) */}
			{alerts.length > 0 ? (
				<div className="space-y-3">
					{alerts.map((alert) => (
						<AlertCard key={alert.id} alert={alert} />
					))}
				</div>
			) : (
				<Card className="border-l-4 border-l-green-500 bg-green-50">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<span className="text-lg">✅</span>
							<div>
								<p className="font-medium text-gray-900">모든 시스템 정상</p>
								<p className="text-sm text-gray-600">현재 특별한 알림이 없습니다.</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* 오늘의 테스트 성과 (TOP 3만) */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<PopularTestsCard topTests={topTests} renderTrendIcon={renderTrendIcon} />
				<QuickActionCard />
			</div>
		</div>
	);
}
