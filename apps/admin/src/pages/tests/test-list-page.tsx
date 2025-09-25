import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePagination } from '@repo/shared';
import { testService } from '@/shared/api';
import type { Test, TestStatus, TestType } from '@repo/supabase';
import { DataTable, type Column, DefaultPagination, Badge } from '@repo/ui';
import { TestDetailModal } from '@/components/test/test-detail-modal';
import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { useColumnRenderers } from '@/shared/hooks';
import { PAGINATION, TEST_STATUS_OPTIONS } from '@/shared/lib/constants';
import { getTestStatusInfo, getTestTypeInfo } from '@/shared/lib/test-utils';

export function TestListPage() {
	const navigate = useNavigate();
	const renderers = useColumnRenderers();

	const [tests, setTests] = useState<Test[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [modalTest, setModalTest] = useState<Test | null>(null);
	const [selectedTests, setSelectedTests] = useState<string[]>([]);
	const [totalTests, setTotalTests] = useState(0);
	const [filters, setFilters] = useState({
		search: '',
		status: 'all' as 'all' | TestStatus,
		type: 'all' as 'all' | TestType,
		category: 'all',
	});

	const pagination = usePagination({
		totalItems: totalTests,
		defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
	});

	// 간단한 통계 (필요한 것만)
	const [stats, setStats] = useState({
		total: 0,
		published: 0,
		draft: 0,
		scheduled: 0,
		responses: 0,
	});

	// 모든 데이터를 한번에 로딩
	const loadData = useCallback(
		async (includeStats = false) => {
			setLoading(true);
			setError(null);

			try {
				const data = await testService.getAllTests();

				// 필터링 적용
				const filteredData = data.filter((test) => {
					const matchesSearch =
						test.title.toLowerCase().includes(filters.search.toLowerCase()) ||
						(test.description || '').toLowerCase().includes(filters.search.toLowerCase());

					// status 필터링
					const testStatus = test.status || 'draft';
					const matchesStatus = filters.status === 'all' || testStatus === filters.status;

					// type 필터링
					const matchesType = filters.type === 'all' || test.type === filters.type;

					return matchesSearch && matchesStatus && matchesType;
				});

				setTests(filteredData as Test[]);
				setTotalTests(filteredData.length);

				// 통계 계산
				if (includeStats) {
					const total = data.length;
					const published = data.filter((test) => test.status === 'published').length;
					const draft = data.filter((test) => test.status === 'draft').length;
					const scheduled = data.filter((test) => test.status === 'scheduled').length;
					const responses = data.reduce((sum, test) => sum + (test.response_count || 0), 0);

					setStats({
						total,
						published,
						draft,
						scheduled,
						responses,
					});
				}
			} catch (error) {
				console.error('데이터 로딩 실패:', error);
				setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
			} finally {
				setLoading(false);
			}
		},
		[filters.search, filters.status, filters.type]
	);

	// 필터 변경 시 첫 페이지로 이동하고 데이터 로딩 (초기 로딩 포함)
	useEffect(() => {
		loadData(true); // 통계도 함께 로딩
	}, [filters.search, filters.status, filters.type, filters.category, loadData]);

	// 개별 테스트 상태 변경 - 서버 요청 후 즉시 UI 업데이트
	const handleTogglePublish = useCallback(async (testId: string, newStatus: string) => {
		try {
			const isPublished = newStatus === 'published';
			await testService.togglePublishStatus(testId, isPublished);
			// 상태 변경 후 즉시 UI 업데이트
			setTests((prev) =>
				prev.map((test) =>
					test.id === testId
						? {
								...test,
								status: newStatus as 'published' | 'draft',
						  }
						: test
				)
			);
			// 통계도 즉시 업데이트
			setStats((prev) => ({
				...prev,
				published: isPublished ? prev.published + 1 : prev.published - 1,
				draft: isPublished ? prev.draft - 1 : prev.draft + 1,
			}));
		} catch (error) {
			console.error('상태 변경 실패:', error);
		}
	}, []);

	// 테스트 삭제 처리 - 확인 후 삭제하고 목록 새로고침
	const handleDelete = useCallback(
		async (testId: string) => {
			if (!confirm('정말로 이 테스트를 삭제하시겠습니까?')) return;

			try {
				await testService.deleteTest(testId);
				loadData(true); // 통계도 함께 새로고침
			} catch (error) {
				console.error('테스트 삭제 실패:', error);
			}
		},
		[loadData]
	);

	// 대량 상태 변경 - 선택된 여러 테스트 상태를 한번에 변경
	const handleBulkPublish = async (isPublished: boolean) => {
		if (selectedTests.length === 0) return;

		try {
			await Promise.all(selectedTests.map((testId) => testService.togglePublishStatus(testId, isPublished)));
			setSelectedTests([]);
			loadData(true); // 통계도 함께 새로고침
		} catch (error) {
			console.error('대량 상태 변경 실패:', error);
		}
	};

	// 대량 삭제
	const handleBulkDelete = async () => {
		if (selectedTests.length === 0) return;
		if (!confirm(`선택한 ${selectedTests.length}개의 테스트를 삭제하시겠습니까?`)) return;

		try {
			await Promise.all(selectedTests.map((testId) => testService.deleteTest(testId)));
			setSelectedTests([]);
			loadData(true); // 통계도 함께 새로고침
		} catch (error) {
			console.error('대량 삭제 실패:', error);
		}
	};

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
						<Badge variant="outline" className="text-xs">
							{statusInfo.name}
						</Badge>
					);
				},
			},
			{
				id: 'responses',
				header: '응답수',
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
			{/* 간단한 통계 */}
			<StatsCards
				stats={[
					{ id: 'total', label: '전체 테스트', value: stats.total },
					{ id: 'published', label: '공개', value: stats.published },
					{ id: 'draft', label: '초안', value: stats.draft },
					{ id: 'scheduled', label: '예약', value: stats.scheduled },
					{ id: 'responses', label: '총 응답', value: stats.responses },
				]}
				columns={5}
			/>

			{/* Search & Filters */}
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
				values={filters}
				onFilterChange={(newFilters) => {
					setFilters({
						search: newFilters.search || '',
						status: (newFilters.status as 'all' | TestStatus) || 'all',
						type: 'all',
						category: 'all',
					});
				}}
			/>

			{/* Bulk Actions */}
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

			{/* Test List */}
			<DataState loading={loading} error={error} data={tests} onRetry={() => loadData(true)}>
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

			{/* Pagination */}
			<DefaultPagination
				currentPage={pagination.currentPage}
				totalPages={pagination.totalPages}
				onPageChange={pagination.setPage}
				className="mt-6"
			/>

			{/* Test Detail Modal */}
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
