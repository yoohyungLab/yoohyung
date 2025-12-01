import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { PAGINATION, TEST_STATUSES } from '@/constants';
import { HREF } from '@/constants/routes';
import { useAnalytics } from '@/hooks';
import { useTableColumns } from '@/hooks/useTableColumns';
import { usePagination } from '@pickid/shared';
import type { AnalyticsFilters, Test } from '@pickid/supabase';
import { DataTable, DefaultPagination } from '@pickid/ui';
import { Users } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type TestWithAnalytics = Test & {
	avg_completion_time?: number;
};

export function AnalyticsPage() {
	const navigate = useNavigate();

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
		defaultPageSize: PAGINATION.pageSize,
	});

	const handleTestSelect = useCallback(
		(test: Test) => {
			navigate(HREF.analyticsTest(test.id));
		},
		[navigate]
	);

	const handleFilterChange = useCallback((newFilters: Partial<AnalyticsFilters>) => {
		setFilters((prev: AnalyticsFilters) => ({ ...prev, ...newFilters }));
	}, []);

	const columnConfigs = useMemo(
		() => [
			{
				id: 'title',
				header: '테스트명',
				type: 'text' as const,
				accessor: 'title',
				className: 'font-medium text-neutral-900',
				maxLength: 50,
			},
			{
				id: 'status',
				header: '상태',
				type: 'badge' as const,
				badge: {
					getValue: (data: TestWithAnalytics) => data.status || 'draft',
					getVariant: (value: string) => {
						const statusKey = value as keyof typeof TEST_STATUSES;
						return (TEST_STATUSES[statusKey]?.variant || 'default') as
							| 'success'
							| 'outline'
							| 'info'
							| 'destructive'
							| 'default';
					},
					getLabel: (value: string) => {
						const statusKey = value as keyof typeof TEST_STATUSES;
						return TEST_STATUSES[statusKey]?.label || value;
					},
				},
			},
			{
				id: 'responses',
				header: '응답수',
				type: 'custom' as const,
				customRender: (data: TestWithAnalytics) => (
					<div className="flex items-center gap-1">
						<Users className="w-4 h-4 text-gray-500" />
						<span className="font-medium">{(data.response_count || 0).toLocaleString()}</span>
					</div>
				),
			},
			{
				id: 'completion_rate',
				header: '완료율',
				type: 'custom' as const,
				customRender: (data: TestWithAnalytics) => {
					const rate =
						data.response_count && data.start_count ? Math.round((data.response_count / data.start_count) * 100) : 0;
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
				type: 'custom' as const,
				customRender: (data: TestWithAnalytics) => {
					const avgTime = data.avg_completion_time || 0;
					const minutes = Math.floor(avgTime / 60);
					const seconds = avgTime % 60;
					const timeText = minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;

					return <span className="text-sm">{avgTime > 0 ? timeText : '-'}</span>;
				},
			},
			{
				id: 'created_at',
				header: '생성일',
				type: 'date' as const,
				accessor: 'created_at',
			},
		],
		[]
	);

	const { columns } = useTableColumns<TestWithAnalytics>(columnConfigs);

	return (
		<div className="space-y-6 p-6">
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

			<BulkActions selectedCount={selectedTests.length} actions={[]} onClear={() => setSelectedTests([])} />

			<DataState loading={loading} data={tests}>
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

			<DefaultPagination
				currentPage={pagination.currentPage}
				totalPages={pagination.totalPages}
				onPageChange={pagination.setPage}
			/>
		</div>
	);
}
