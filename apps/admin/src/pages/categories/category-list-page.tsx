import { CategoryCreateModal, CategorySortModal } from '@/components/category';
import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { PAGINATION, CATEGORY_STATUSES } from '@/constants';
import { useTableColumns } from '@/hooks/useTableColumns';
import { useCategories } from '@/hooks/useCategories';
import { toOptions } from '@/utils/options';
import { usePagination } from '@pickid/shared';
import type { Category } from '@pickid/supabase';
import { Button, DataTable, DefaultPagination } from '@pickid/ui';
import { useMemo, useState } from 'react';

export default function CategoryListPage() {
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
		defaultPageSize: PAGINATION.pageSize,
	});

	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showSortModal, setShowSortModal] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);

	const handleBulkStatusChange = async (isActive: boolean) => {
		if (selectedCategories.length === 0) return;
		await bulkUpdateStatus(selectedCategories, isActive);
		setSelectedCategories([]);
	};

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

	const columnConfigs = useMemo(() => {
		const handleStatusChange = async (categoryId: string, isActive: boolean) => {
			await updateCategoryStatus(categoryId, isActive);
		};

		const handleDeleteCategory = async (categoryId: string) => {
			const category = categories.find((c) => c.id === categoryId);
			const categoryName = category?.name || '이 카테고리';

			if (!confirm(`정말로 "${categoryName}" 카테고리를 삭제하시겠습니까?`)) return;

			await deleteCategory(categoryId);
		};

		const handleEditCategory = (categoryId: string) => {
			const category = categories.find((c) => c.id === categoryId);
			if (category) {
				setEditingCategory(category);
				setShowCreateModal(true);
			}
		};

		return [
			{
				id: 'name',
				header: '카테고리명',
				type: 'badge' as const,
				badge: {
					getValue: (data: Category) => data.name,
					getVariant: () => 'outline' as const,
				},
			},
			{
				id: 'sort_order',
				header: '순서',
				type: 'badge' as const,
				badge: {
					getValue: (data: Category) => String(data.sort_order || 0),
					getVariant: () => 'outline' as const,
				},
				className: 'font-mono',
			},
			{
				id: 'status',
				header: '상태',
				type: 'badge' as const,
				badge: {
					getValue: (data: Category) => data.status || 'inactive',
					getVariant: (value: string) => {
						const statusKey = value as keyof typeof CATEGORY_STATUSES;
						return (CATEGORY_STATUSES[statusKey]?.variant || 'default') as
							| 'success'
							| 'outline'
							| 'info'
							| 'destructive'
							| 'default';
					},
					getLabel: (value: string) => {
						const statusKey = value as keyof typeof CATEGORY_STATUSES;
						return CATEGORY_STATUSES[statusKey]?.label || value;
					},
				},
			},
			{
				id: 'created_at',
				header: '생성일',
				type: 'date' as const,
				accessor: 'created_at',
				className: 'text-xs text-neutral-600',
			},
			{
				id: 'actions',
				header: '액션',
				type: 'actions' as const,
				actions: [
					{
						type: 'edit' as const,
						onClick: (id: string) => handleEditCategory(id),
					},
					{
						type: 'status' as const,
						onClick: (id: string, data?: Category) => {
							if (!data?.status) return;
							const isActive = data.status === 'active';
							handleStatusChange(id, !isActive);
						},
						statusOptions: toOptions(CATEGORY_STATUSES),
					},
					{
						type: 'delete' as const,
						onClick: (id: string) => handleDeleteCategory(id),
					},
				],
			},
		];
	}, [updateCategoryStatus, deleteCategory, categories, setEditingCategory, setShowCreateModal]);

	const { columns } = useTableColumns<Category>(columnConfigs);

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
