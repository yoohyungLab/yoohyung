import { Card, CardContent, IconButton } from '@pickid/ui';
import { LoadingState } from '@/components/ui';
import { Activity, BarChart3, FileText, Plus, Target, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboard } from '@/hooks/useDashboard';
import { KPICard, QuickActionCard, PopularTestsCard } from '@/components/dashboard';

export function DashboardPage() {
	const { stats, topTests, loading, lastUpdated } = useDashboard();

	const renderTrendIcon = (trend: string) => {
		switch (trend) {
			case 'up':
				return <TrendingUp className="w-4 h-4 text-neutral-600" />;
			case 'down':
				return <TrendingDown className="w-4 h-4 text-neutral-600" />;
			default:
				return <Activity className="w-4 h-4 text-neutral-600" />;
		}
	};

	if (loading) {
		return <LoadingState message="대시보드를 불러오는 중..." />;
	}

	return (
		<div className="space-y-6 p-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-neutral-900">대시보드</h1>
					<p className="text-neutral-600 mt-1">오늘의 핵심 지표</p>
					<p className="text-sm text-neutral-500 mt-1">업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}</p>
				</div>
				<div className="flex items-center gap-3">
					<Link to="/tests/create">
						<IconButton
							className="bg-neutral-600 hover:bg-neutral-700 text-white"
							icon={<Plus className="w-4 h-4" />}
							text="테스트 만들기"
						/>
					</Link>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<KPICard
					title="활성 테스트"
					value={stats.publishedTests}
					icon={<FileText className="w-6 h-6" />}
					color="blue"
					subtitle={`총 ${stats.totalTests}개`}
				/>

				<KPICard
					title="오늘 응답"
					value={stats.todayResponses}
					icon={<Target className="w-6 h-6" />}
					color="green"
					growth={stats.responseGrowth}
					showGrowth={true}
				/>

				<KPICard
					title="오늘 방문자"
					value={stats.todayVisitors}
					icon={<Users className="w-6 h-6" />}
					color="purple"
					growth={stats.visitorGrowth}
					showGrowth={true}
				/>

				<KPICard
					title="완료율"
					value={`${stats.weeklyCompletionRate}%`}
					icon={<BarChart3 className="w-6 h-6" />}
					color="orange"
					subtitle="이번 주 평균"
				/>
			</div>

			<Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-semibold text-neutral-900">🔄 실시간 활동</h3>
							<p className="text-sm text-neutral-600 mt-1">Google Analytics에서 더 정확한 실시간 데이터 확인 가능</p>
						</div>
						<div className="text-sm text-neutral-500">
							<p>GA4 → 실시간 → 개요</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<PopularTestsCard topTests={topTests} renderTrendIcon={renderTrendIcon} />
				<QuickActionCard />
			</div>
		</div>
	);
}
