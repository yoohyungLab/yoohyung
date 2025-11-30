import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { AdminCard, AdminCardContent } from '@/components/ui/admin-card';
import { useAnalytics } from '@/hooks';
import { useColumnRenderers } from '@/hooks/use-column-renderers';
import { PAGINATION } from '@/constants';
import { getStatusConfig } from '@/utils/utils';
import { usePagination } from '@pickid/shared';
import type { AnalyticsFilters, Test } from '@pickid/supabase';
import { Badge, DataTable, DefaultPagination, type Column } from '@pickid/ui';
import { Clock, Users } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HREF } from '@/constants/routes';

// 분석용 테스트 타입 (평균 소요시간 포함)
type TestWithAnalytics = Test & {
	avg_completion_time?: number;
};

export function AnalyticsPage() {
	const renderers = useColumnRenderers();
	const navigate = useNavigate();

	// 통합된 useAnalytics 훅 사용
	const [filters, setFilters] = React.useState<AnalyticsFilters>({
		search: '',
		status: 'all',
		category: 'all',
		timeRange: '7d',
	});

	const { tests, loading, stats } = useAnalytics(filters);
	const [selectedTests, setSelectedTests] = React.useState<string[]>([]);

	const totalTests = tests.length;

	const pagination = usePagination({
		totalItems: totalTests,
		defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
	});

	// 핸들러 함수들
	const handleTestSelect = useCallback(
		(test: Test) => {
			navigate(HREF.ANALYTICS_TEST_DETAIL(test.id));
		},
		[navigate]
	);

	const handleFilterChange = useCallback((newFilters: Partial<AnalyticsFilters>) => {
		setFilters((prev: AnalyticsFilters) => ({ ...prev, ...newFilters }));
	}, []);

	// 테이블 컬럼 정의
	const columns: Column<TestWithAnalytics>[] = useMemo(
		() => [
			{
				id: 'title',
				header: '테스트명',
				cell: ({ row }) => (
					<div className="min-w-0">
						<div className="font-medium text-neutral-900 truncate">{row.original.title}</div>
					</div>
				),
			},
			{
				id: 'status',
				header: '상태',
				cell: ({ row }) => {
					const status = row.original.status;
					const statusConfig = getStatusConfig('test', status || 'draft');
					return (
						<Badge variant="outline" className="whitespace-nowrap">
							{statusConfig.text}
						</Badge>
					);
				},
			},
			{
				id: 'responses',
				header: '응답수',
				cell: ({ row }) => (
					<div className="flex items-center gap-1">
						<Users className="w-4 h-4 text-gray-500" />
						<span className="font-medium">{row.original.response_count?.toLocaleString() || 0}</span>
					</div>
				),
			},
			{
				id: 'completion_rate',
				header: '완료율',
				cell: ({ row }) => {
					const rate =
						row.original.response_count && row.original.start_count
							? Math.round((row.original.response_count / row.original.start_count) * 100)
							: 0;
					return (
						<div className="flex items-center gap-2">
							<div className="w-16 bg-neutral-200 rounded-full h-2">
								<div className="bg-neutral-600 h-2 rounded-full" style={{ width: `${Math.min(rate, 100)}%` }} />
							</div>
							<span className="text-sm font-medium">{rate}%</span>
						</div>
					);
				},
			},
			{
				id: 'avg_time',
				header: '평균 소요시간',
				cell: ({ row }) => {
					const avgTime = row.original.avg_completion_time || 0;
					const minutes = Math.floor(avgTime / 60);
					const seconds = avgTime % 60;
					const timeText = minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;

					return <span className="text-sm">{avgTime > 0 ? timeText : '-'}</span>;
				},
			},
			{
				id: 'created_at',
				header: '생성일',
				cell: ({ row }) => renderers.renderDate(row.original.created_at),
			},
		],
		[renderers]
	);

	return (
		<div className="space-y-6 p-6">
			{/* 통계 카드 */}
			<StatsCards
				stats={[
					{ id: 'total', label: '전체 테스트', value: stats.total },
					{ id: 'published', label: '발행됨', value: stats.published },
					{ id: 'draft', label: '초안', value: stats.draft },
					{ id: 'scheduled', label: '예약됨', value: stats.scheduled },
					{
						id: 'responses',
						label: '총 응답수',
						value: stats.totalResponses,
					},
					{ id: 'completion_rate', label: '완료율', value: stats.completionRate },
				]}
				columns={6}
			/>

			{/* 검색 및 필터 */}
			<FilterBar
				filters={{
					search: true,
					status: {
						options: [
							{ value: 'all', label: '전체' },
							{ value: 'published', label: '발행됨' },
							{ value: 'draft', label: '초안' },
							{ value: 'scheduled', label: '예약됨' },
						],
					},
					category: {
						options: [
							{ value: 'all', label: '전체 카테고리' },
							{ value: 'personality', label: '성격' },
							{ value: 'career', label: '진로' },
							{ value: 'relationship', label: '관계' },
						],
					},
				}}
				values={{
					search: filters.search || '',
					status: filters.status || 'all',
					category: filters.category || 'all',
				}}
				onFilterChange={(newFilters) => {
					handleFilterChange({
						search: newFilters.search || '',
						status: (newFilters.status as 'all' | 'published' | 'draft' | 'scheduled') || 'all',
						category: (newFilters.category as 'all' | 'personality' | 'career' | 'relationship') || 'all',
						timeRange: filters.timeRange,
					});
				}}
			/>

			{/* 대량 작업 */}
			<BulkActions selectedCount={selectedTests.length} actions={[]} onClear={() => setSelectedTests([])} />

			{/* 테스트 목록 */}
			<DataState loading={loading} data={tests} emptyMessage="분석할 테스트가 없습니다. 테스트를 생성해보세요.">
				<DataTable
					data={tests}
					columns={columns}
					selectable={true}
					selectedItems={selectedTests}
					onSelectionChange={setSelectedTests}
					getRowId={(test: Test) => test.id}
					onRowClick={(test: Test) => handleTestSelect(test)}
				/>
			</DataState>

			{/* 페이지네이션 */}
			<DefaultPagination
				currentPage={pagination.currentPage}
				totalPages={pagination.totalPages}
				onPageChange={pagination.setPage}
			/>
		</div>
	);
}
