import React, { useCallback, useState, useMemo } from 'react';
import { usePagination } from '@pickid/shared';
import { DataTable, type Column, DefaultPagination, Badge, Button } from '@pickid/ui';
import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { CategoryCreateModal, CategorySortModal } from '@/components/category';
import { useColumnRenderers } from '@/hooks/use-column-renderers';
import { useCategories } from '@/hooks/useCategories';
import { PAGINATION, CATEGORY_STATUS_OPTIONS } from '@/constants';
import { getStatusConfig } from '@/utils/utils';
import type { Category } from '@pickid/supabase';

export default function CategoryListPage() {
	const renderers = useColumnRenderers();

	const {
		categories,
		loading,
		filters,
		stats,
		updateFilters,
		createCategory,
		updateCategory,
		updateCategoryStatus,
		bulkUpdateStatus,
		deleteCategory,
	} = useCategories();

	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const pagination = usePagination({
		totalItems: categories.length,
		defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
	});

	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showSortModal, setShowSortModal] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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
			const category = categories.find((c) => c.id === categoryId);
			const categoryName = category?.name || '이 카테고리';

			if (!confirm(`정말로 "${categoryName}" 카테고리를 삭제하시겠습니까?`)) return;

			await deleteCategory(categoryId);
		},
		[deleteCategory, categories]
	);

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

	const handleCreateSuccess = async (categoryData?: {
		name: string;
		slug: string;
		sort_order?: number;
		status?: 'active' | 'inactive';
	}) => {
		if (editingCategory && categoryData) {
			await updateCategory(editingCategory.id, categoryData);
		} else if (categoryData) {
			await createCategory(categoryData);
		}

		setEditingCategory(null);
		setShowCreateModal(false);
	};

	const handleSortSuccess = () => {
		setShowSortModal(false);
	};

	const columns: Column<Category>[] = useMemo(
		() => [
			{
				id: 'name',
				header: '카테고리명',
				cell: ({ row }) => (
					<Badge variant="outline" className="whitespace-nowrap">
						{row.original.name}
					</Badge>
				),
			},
			{
				id: 'sort_order',
				header: '순서',
				cell: ({ row }) => (
					<Badge variant="outline" className="font-mono whitespace-nowrap">
						{row.original.sort_order}
					</Badge>
				),
			},
			{
				id: 'status',
				header: '상태',
				cell: ({ row }) => {
					const statusConfig = getStatusConfig('category', row.original.status || 'inactive');
					const statusColor = statusConfig.color || '';
					const statusText = statusConfig.text || row.original.status;
					return (
						<Badge variant="outline" className="whitespace-nowrap">
							{statusText}
						</Badge>
					);
				},
			},
			{
				id: 'created_at',
				header: '생성일',
				cell: ({ row }) => (
					<div className="text-xs text-neutral-600">
						{new Date(row.original.created_at).toLocaleDateString('ko-KR')}
					</div>
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
								const isActive = data?.status === 'active';
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
		<div className="space-y-6 p-6">
			<StatsCards
				stats={[
					{ id: 'total', label: '전체', value: stats.total },
					{ id: 'active', label: '활성', value: stats.active, color: 'blue' },
					{ id: 'inactive', label: '비활성', value: stats.inactive, color: 'red' },
				]}
				columns={3}
			/>

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
				values={{
					search: filters.search || '',
					status: filters.status || 'all',
				}}
				onFilterChange={(newFilters) => {
					updateFilters({
						search: newFilters.search || '',
						status: (newFilters.status as 'all' | 'active' | 'inactive') || 'all',
					});
				}}
				actions={
					<div className="flex gap-2">
						<Button
							onClick={() => setShowSortModal(true)}
							variant="outline"
							size="sm"
							title="카테고리 순서 변경"
							text="순서변경"
						/>
						<Button onClick={() => setShowCreateModal(true)} size="sm" title="새 카테고리 추가" text="추가" />
					</div>
				}
			/>

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

			<DataState loading={loading} data={categories}>
				<DataTable
					data={categories}
					columns={columns}
					selectable={true}
					selectedItems={selectedCategories}
					onSelectionChange={setSelectedCategories}
					getRowId={(category: Category) => category.id}
				/>
			</DataState>

			<DefaultPagination
				currentPage={pagination.currentPage}
				totalPages={pagination.totalPages}
				onPageChange={pagination.setPage}
				className="mt-6"
			/>

			<CategoryCreateModal
				isOpen={showCreateModal}
				onClose={() => {
					setEditingCategory(null);
					setShowCreateModal(false);
				}}
				onSuccess={handleCreateSuccess}
				editCategory={editingCategory}
			/>

			<CategorySortModal
				isOpen={showSortModal}
				onClose={() => setShowSortModal(false)}
				onSuccess={handleSortSuccess}
				categories={categories}
			/>
		</div>
	);
}
