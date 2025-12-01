import { TestDetailModal } from '@/components/test/test-detail-modal';
import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { useTests } from '@/hooks/useTests';
import { useTableColumns } from '@/hooks/useTableColumns';
import { PAGINATION, TEST_STATUSES, TEST_TYPES } from '@/constants';
import { toOptions } from '@/utils/options';
import { usePagination } from '@pickid/shared';
import type { Test, TestStatus } from '@pickid/supabase';
import { DataTable, DefaultPagination } from '@pickid/ui';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HREF } from '@/constants/routes';
import { COMMON_MESSAGES } from '@pickid/shared';

export function TestListPage() {
	const navigate = useNavigate();
	const { tests, loading, filters, stats, updateTestStatus, deleteTest, updateFilters } = useTests();
	const [modalTest, setModalTest] = useState<Test | null>(null);
	const [selectedTests, setSelectedTests] = useState<string[]>([]);

	const pagination = usePagination({
		totalItems: tests.length,
		defaultPageSize: PAGINATION.pageSize,
	});

	const handleTogglePublish = async (testId: string, newStatus: string) => {
		await updateTestStatus({ id: testId, status: newStatus as TestStatus });
	};

	const handleDelete = async (testId: string) => {
		if (!confirm(COMMON_MESSAGES.CONFIRM_DELETE)) return;
		await deleteTest(testId);
	};

	const handleBulkPublish = async (isPublished: boolean) => {
		if (selectedTests.length === 0) return;
		await Promise.all(
			selectedTests.map((testId) =>
				updateTestStatus({ id: testId, status: (isPublished ? 'published' : 'draft') as TestStatus })
			)
		);
		setSelectedTests([]);
	};

	const handleBulkDelete = async () => {
		if (selectedTests.length === 0) return;
		if (!confirm(`선택한 ${selectedTests.length}개의 테스트를 삭제하시겠습니까?`)) return;
		await Promise.all(selectedTests.map((testId) => deleteTest(testId)));
		setSelectedTests([]);
	};

	const columnConfigs = useMemo(() => {
		const handleTogglePublishAction = async (id: string, data?: Record<string, unknown>) => {
			await handleTogglePublish(id, data?.status as string);
		};

		const handleDeleteAction = async (id: string) => {
			await handleDelete(id);
		};

		return [
			{
				id: 'title',
				header: '테스트',
				type: 'text' as const,
				accessor: 'title',
				className: 'font-medium text-neutral-900',
				maxLength: 50,
			},
			{
				id: 'type',
				header: '유형',
				type: 'badge' as const,
				badge: {
					getValue: (data: Test) => data.type || 'psychology',
					getLabel: (value: string) => {
						const typeKey = value as keyof typeof TEST_TYPES;
						return TEST_TYPES[typeKey]?.name || value;
					},
					getVariant: () => 'outline' as const,
				},
			},
			{
				id: 'status',
				header: '상태',
				type: 'badge' as const,
				badge: {
					getValue: (data: Test) => data.status || 'draft',
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
				header: '참여수',
				type: 'number' as const,
				accessor: 'response_count',
			},
			{
				id: 'created_at',
				header: '생성일',
				type: 'date' as const,
				accessor: 'created_at',
			},
			{
				id: 'actions',
				header: '액션',
				type: 'actions' as const,
				actions: [
					{
						type: 'edit' as const,
						onClick: (id: string) => navigate(HREF.testEdit(id)),
					},
					{
						type: 'status' as const,
						onClick: handleTogglePublishAction,
						statusOptions: toOptions(TEST_STATUSES),
					},
					{
						type: 'delete' as const,
						onClick: handleDeleteAction,
					},
				],
			},
		];
	}, [navigate, updateTestStatus, deleteTest]);

	const { columns } = useTableColumns<Test>(columnConfigs);

	return (
		<div className="space-y-6 p-6">
			<StatsCards
				stats={[
					{ id: 'total', label: '전체 테스트', value: stats?.total || 0 },
					{ id: 'published', label: '공개', value: stats?.published || 0 },
					{ id: 'draft', label: '초안', value: stats?.draft || 0 },
					{ id: 'scheduled', label: '예약', value: stats?.scheduled || 0 },
					{
						id: 'responses',
						label: '총 참여',
						value: 'responses' in (stats || {}) ? (stats as unknown as { responses?: number }).responses || 0 : 0,
					},
				]}
				columns={5}
			/>

			<FilterBar
				filters={{
					search: true,
					status: {
						options: [
							{ value: 'all', label: '전체 상태' },
							{ value: 'published', label: '공개' },
							{ value: 'draft', label: '초안' },
							{ value: 'scheduled', label: '예약' },
						],
					},
				}}
				values={filters as unknown as Record<string, string>}
				onFilterChange={(newFilters) => {
					updateFilters({
						search: newFilters.search || '',
						status: (newFilters.status as 'all' | TestStatus) || 'all',
					});
				}}
			/>

			<BulkActions
				selectedCount={selectedTests.length}
				actions={[
					{
						id: 'publish',
						label: '공개',
						onClick: () => handleBulkPublish(true),
					},
					{
						id: 'unpublish',
						label: '비공개',
						onClick: () => handleBulkPublish(false),
					},
					{
						id: 'delete',
						label: '삭제',
						variant: 'destructive',
						onClick: handleBulkDelete,
					},
				]}
				onClear={() => setSelectedTests([])}
			/>

			<DataState loading={loading} data={tests}>
				<DataTable
					data={tests}
					columns={columns}
					selectable={true}
					selectedItems={selectedTests}
					onSelectionChange={setSelectedTests}
					getRowId={(test: Test) => test.id}
					onRowClick={(test: Test) => {
						setModalTest(test);
					}}
				/>
			</DataState>

			<DefaultPagination
				currentPage={pagination.currentPage}
				totalPages={pagination.totalPages}
				onPageChange={pagination.setPage}
				className="mt-6"
			/>

			{modalTest && (
				<TestDetailModal
					test={modalTest}
					onClose={() => setModalTest(null)}
					onTogglePublish={async (testId: string, currentStatus: boolean) => {
						const newStatus = currentStatus ? 'draft' : 'published';
						await handleTogglePublish(testId, newStatus);
						const updatedTest = tests.find((t) => t.id === testId);
						if (updatedTest) {
							setModalTest({
								...updatedTest,
								status: newStatus,
							});
						}
					}}
					onDelete={handleDelete}
				/>
			)}
		</div>
	);
}
