import { TestDetailModal } from '@/components/test/test-detail-modal';
import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { useTests } from '@/hooks/useTests';
import { useColumnRenderers } from '@/shared/hooks';
import { PAGINATION, TEST_STATUS_OPTIONS } from '@/shared/lib/constants';
import { getTestStatusInfo, getTestTypeInfo } from '@/shared/lib/test-utils';
import { getTestStatusStyle } from '@/shared/lib/utils';
import { usePagination } from '@pickid/shared';
import type { Test, TestStatus } from '@pickid/supabase';
import { Badge, DataTable, DefaultPagination, type Column } from '@pickid/ui';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function TestListPage() {
	const navigate = useNavigate();
	const renderers = useColumnRenderers();

	const { tests, loading, error, filters, stats, togglePublishStatus, deleteTest, updateFilters } = useTests();
	const [modalTest, setModalTest] = useState<Test | null>(null);
	const [selectedTests, setSelectedTests] = useState<string[]>([]);

	const pagination = usePagination({
		totalItems: tests.length,
		defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
	});

	// 개별 테스트 상태 변경
	const handleTogglePublish = useCallback(
		async (testId: string, newStatus: string) => {
			const isPublished = newStatus === 'published';
			await togglePublishStatus(testId, isPublished);
		},
		[togglePublishStatus]
	);

	// 테스트 삭제 처리
	const handleDelete = useCallback(
		async (testId: string) => {
			if (!confirm('정말로 이 테스트를 삭제하시겠습니까?')) return;
			await deleteTest(testId);
		},
		[deleteTest]
	);

	// 대량 상태 변경
	const handleBulkPublish = useCallback(
		async (isPublished: boolean) => {
			if (selectedTests.length === 0) return;
			await Promise.all(selectedTests.map((testId) => togglePublishStatus(testId, isPublished)));
			setSelectedTests([]);
		},
		[selectedTests, togglePublishStatus]
	);

	// 대량 삭제
	const handleBulkDelete = useCallback(async () => {
		if (selectedTests.length === 0) return;
		if (!confirm(`선택한 ${selectedTests.length}개의 테스트를 삭제하시겠습니까?`)) return;
		await Promise.all(selectedTests.map((testId) => deleteTest(testId)));
		setSelectedTests([]);
	}, [selectedTests, deleteTest]);

	// Table columns definition (memoized for performance)
	const columns: Column<Test>[] = useMemo(
		() => [
			{
				id: 'title',
				header: '테스트',
				cell: ({ row }) => (
					<div className="min-w-0">
						<div className="font-medium text-gray-900 truncate">{row.original.title}</div>
					</div>
				),
			},
			{
				id: 'type',
				header: '유형',
				cell: ({ row }) => {
					const typeInfo = getTestTypeInfo(row.original.type || 'psychology');
					return (
						<Badge variant="outline" className="text-xs">
							{typeInfo.name}
						</Badge>
					);
				},
			},
			{
				id: 'status',
				header: '상태',
				cell: ({ row }) => {
					const status = row.original.status || 'draft';
					const statusInfo = getTestStatusInfo(status);
					return (
						<Badge variant="outline" className={`h-6 border text-xs ${getTestStatusStyle(status)}`}>
							{statusInfo.name}
						</Badge>
					);
				},
			},
			{
				id: 'responses',
				header: '참여수',
				cell: ({ row }) => renderers.renderNumber(row.original.response_count || 0),
			},
			{
				id: 'created_at',
				header: '생성일',
				cell: ({ row }) => renderers.renderDate(row.original.created_at),
			},
			{
				id: 'actions',
				header: '액션',
				cell: ({ row }) =>
					renderers.renderActions(row.original.id, row.original as unknown as Record<string, unknown>, [
						{
							type: 'edit',
							onClick: () => navigate(`/tests/${row.original.id}/edit`),
						},
						{
							type: 'status',
							onClick: (id, data) => handleTogglePublish(id, data?.status as string),
							statusOptions: [...TEST_STATUS_OPTIONS],
						},
						{
							type: 'delete',
							onClick: (id) => handleDelete(id),
						},
					]),
			},
		],
		[renderers, handleTogglePublish, handleDelete, navigate]
	);

	return (
		<div className="space-y-6 p-5">
			{/* 통계 카드 */}
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

			{/* 검색 및 필터 */}
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

			{/* 대량 작업 */}
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

			{/* 테스트 목록 */}
			<DataState loading={loading} error={error} data={tests}>
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

			{/* 페이지네이션 */}
			<DefaultPagination
				currentPage={pagination.currentPage}
				totalPages={pagination.totalPages}
				onPageChange={pagination.setPage}
				className="mt-6"
			/>

			{/* 테스트 상세 모달 */}
			{modalTest && (
				<TestDetailModal
					test={modalTest}
					onClose={() => setModalTest(null)}
					onTogglePublish={async (testId: string, currentStatus: boolean) => {
						await handleTogglePublish(testId, currentStatus ? 'published' : 'draft');
						// 모달에 표시된 테스트 정보도 업데이트
						const updatedTest = tests.find((t) => t.id === testId);
						if (updatedTest) {
							setModalTest({
								...updatedTest,
								status: !currentStatus ? 'published' : 'draft',
							});
						}
					}}
					onDelete={handleDelete}
				/>
			)}
		</div>
	);
}
