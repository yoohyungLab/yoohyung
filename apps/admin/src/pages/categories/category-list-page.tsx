import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { usePagination } from '@repo/shared';
import { DataTable, type Column, DefaultPagination, Badge, Button } from '@repo/ui';
import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { CategoryCreateModal, CategorySortModal } from '@/components/category';
import { useColumnRenderers } from '@/shared/hooks';
import { useCategories } from '@/hooks/useCategories';
import { PAGINATION, CATEGORY_STATUS_OPTIONS } from '@/shared/lib/constants';
import { getCategoryStatusBadgeVariant, getCategoryStatusText } from '@/shared/lib/utils';
import type { CategoryFilters, Category } from '@repo/supabase';

type CategoryWithStatus = Category & {
	status?: 'active' | 'inactive';
};

export default function CategoryListPage() {
	const renderers = useColumnRenderers();

	// 커스텀 훅 사용
	const {
		categories,
		loading,
		error,
		totalCategories,
		stats,
		fetchCategories,
		updateCategoryStatus,
		bulkUpdateStatus,
		deleteCategory,
	} = useCategories();

	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [filters, setFilters] = useState({
		search: '',
		status: 'all',
	});
	const pagination = usePagination({
		totalItems: totalCategories,
		defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
	});

	// 모달 상태
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showSortModal, setShowSortModal] = useState(false);
	const [editingCategory, setEditingCategory] = useState<CategoryWithStatus | null>(null);

	// 필터 변경 시 데이터 로딩
	const loadData = useCallback(async () => {
		await fetchCategories(
			{
				search: filters.search || undefined,
				status: filters.status !== 'all' ? filters.status : undefined,
			} as CategoryFilters,
			pagination.currentPage,
			pagination.pageSize
		);
	}, [filters.search, filters.status, pagination.currentPage, pagination.pageSize, fetchCategories]);

	// 필터나 페이지 변경 시 데이터 로딩
	useEffect(() => {
		loadData();
	}, [loadData]);

	// 액션 핸들러들
	const handleStatusChange = useCallback(
		async (categoryId: string, isActive: boolean) => {
			await updateCategoryStatus(categoryId, isActive);
		},
		[updateCategoryStatus]
	);

	const handleBulkStatusChange = async (isActive: boolean) => {
		if (selectedCategories.length === 0) return;
		await bulkUpdateStatus(selectedCategories, isActive);
		setSelectedCategories([]);
	};

	const handleDeleteCategory = useCallback(
		async (categoryId: string) => {
			if (!confirm('정말로 이 카테고리를 삭제하시겠습니까?')) return;
			await deleteCategory(categoryId);
		},
		[deleteCategory]
	);

	// 편집 모달 열기
	const handleEditCategory = useCallback(
		(categoryId: string) => {
			const category = categories.find((c) => c.id === categoryId);
			if (category) {
				setEditingCategory(category);
				setShowCreateModal(true);
			}
		},
		[categories]
	);

	// 모달 핸들러들
	const handleCreateSuccess = () => {
		setEditingCategory(null);
		setShowCreateModal(false);
		loadData();
	};

	const handleSortSuccess = () => {
		setShowSortModal(false);
		loadData();
	};

	// Table columns definition (memoized for performance)
	const columns: Column<CategoryWithStatus>[] = useMemo(
		() => [
			{
				id: 'name',
				header: '카테고리명',
				cell: ({ row }) => (
					<Badge variant="outline" className="h-6">
						{row.original.name}
					</Badge>
				),
			},
			{
				id: 'description',
				header: '설명',
				cell: ({ row }) => (
					<div className="max-w-xs text-xs text-gray-600 line-clamp-2">{row.original.description || '-'}</div>
				),
			},
			{
				id: 'sort_order',
				header: '순서',
				cell: ({ row }) => (
					<Badge variant="outline" className="font-mono bg-gray-50 text-xs h-5">
						{row.original.sort_order}
					</Badge>
				),
			},
			{
				id: 'status',
				header: '상태',
				cell: ({ row }) => {
					const isActive = row.original.is_active ?? false;
					return (
						<Badge variant={getCategoryStatusBadgeVariant(isActive)} className="h-6">
							{getCategoryStatusText(isActive)}
						</Badge>
					);
				},
			},
			{
				id: 'created_at',
				header: '생성일',
				cell: ({ row }) => (
					<div className="text-xs text-gray-600">{new Date(row.original.created_at).toLocaleDateString('ko-KR')}</div>
				),
			},
			{
				id: 'actions',
				header: '액션',
				cell: ({ row }) =>
					renderers.renderActions(row.original.id, row.original as unknown as Record<string, unknown>, [
						{
							type: 'edit',
							onClick: (id) => handleEditCategory(id),
						},
						{
							type: 'status',
							onClick: (id, data) => {
								const isActive = data?.is_active as boolean;
								handleStatusChange(id, !isActive);
							},
							statusOptions: [...CATEGORY_STATUS_OPTIONS],
						},
						{
							type: 'delete',
							onClick: (id) => handleDeleteCategory(id),
						},
					]),
			},
		],
		[renderers, handleStatusChange, handleDeleteCategory, handleEditCategory]
	);

	return (
		<div className="space-y-6 p-5">
			{/* 간단한 통계 */}
			<StatsCards
				stats={[
					{ id: 'total', label: '전체', value: stats.total },
					{ id: 'active', label: '활성', value: stats.active },
					{ id: 'inactive', label: '비활성', value: stats.inactive },
				]}
				columns={3}
			/>

			{/* Search & Filters */}
			<FilterBar
				filters={{
					search: true,
					status: {
						options: [
							{ value: 'all', label: '전체' },
							{ value: 'active', label: '활성' },
							{ value: 'inactive', label: '비활성' },
						],
					},
				}}
				values={filters}
				onFilterChange={(newFilters) => {
					setFilters({
						search: newFilters.search || '',
						status: newFilters.status || 'all',
					});
				}}
				actions={
					<div className="flex gap-2">
						<Button onClick={() => setShowSortModal(true)} variant="outline" size="sm" title="카테고리 순서 변경">
							순서변경
						</Button>
						<Button onClick={() => setShowCreateModal(true)} size="sm" title="새 카테고리 추가">
							추가
						</Button>
					</div>
				}
			/>

			{/* Bulk Actions */}
			<BulkActions
				selectedCount={selectedCategories.length}
				actions={[
					{
						id: 'activate',
						label: '활성화',
						onClick: () => handleBulkStatusChange(true),
					},
					{
						id: 'deactivate',
						label: '비활성화',
						onClick: () => handleBulkStatusChange(false),
					},
				]}
				onClear={() => setSelectedCategories([])}
			/>

			{/* Category List */}
			<DataState loading={loading} error={error} data={categories} onRetry={loadData}>
				<DataTable
					data={categories}
					columns={columns}
					selectable={true}
					selectedItems={selectedCategories}
					onSelectionChange={setSelectedCategories}
					getRowId={(category: CategoryWithStatus) => category.id}
				/>
			</DataState>

			{/* Pagination */}
			<DefaultPagination
				currentPage={pagination.currentPage}
				totalPages={pagination.totalPages}
				onPageChange={pagination.setPage}
				className="mt-6"
			/>

			{/* 카테고리 생성/편집 모달 */}
			<CategoryCreateModal
				isOpen={showCreateModal}
				onClose={() => {
					setEditingCategory(null);
					setShowCreateModal(false);
				}}
				onSuccess={handleCreateSuccess}
				editCategory={editingCategory}
			/>

			{/* 카테고리 순서 변경 모달 */}
			<CategorySortModal
				isOpen={showSortModal}
				onClose={() => setShowSortModal(false)}
				onSuccess={handleSortSuccess}
				categories={categories}
			/>
		</div>
	);
}
