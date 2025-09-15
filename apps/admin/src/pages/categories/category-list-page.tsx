import React, { useCallback, useEffect, useState, useMemo, startTransition } from 'react';
import { usePagination } from '@repo/shared';
import { categoryService, type Category, type CategoryFilters } from '../../api/category.service';
import { DataTable, type Column, DefaultPagination, Badge, Button } from '@repo/ui';
import { AdminCard, BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { CategoryCreateModal, CategorySortModal } from '@/components/category';
import { useColumnRenderers } from '@/shared/hooks';
import { PAGINATION } from '@/shared/lib/constants';
import { getCategoryStatusText, getCategoryStatusBadgeVariant } from '@/shared/lib/utils';
import { Plus, ArrowUpDown } from 'lucide-react';

export default function CategoryListPage() {
    const renderers = useColumnRenderers();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [totalCategories, setTotalCategories] = useState(0);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all' as 'all' | 'active' | 'inactive',
    });
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);

    const pagination = usePagination({
        totalItems: totalCategories,
        defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    });

    // 모든 데이터를 한번에 로딩
    const loadData = useCallback(
        async (includeStats = false) => {
            setLoading(true);
            setError(null);

            try {
                const apiFilters: CategoryFilters = {
                    search: filters.search || undefined,
                    status: filters.status !== 'all' ? filters.status : undefined,
                };

                // 카테고리 데이터 로딩
                const categoryResult = await categoryService.getCategories(apiFilters, pagination.currentPage, pagination.pageSize);
                setCategories(categoryResult.categories);
                setTotalCategories(categoryResult.total);

                // 통계 데이터 로딩
                if (includeStats) {
                    const statsResult = await categoryService.getCategoryStats();
                    setStats(statsResult);
                }
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
                setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        },
        [filters.search, filters.status, pagination.currentPage, pagination.pageSize]
    );

    // 필터 변경 시 첫 페이지로 이동하고 데이터 로딩
    useEffect(() => {
        startTransition(() => {
            if (pagination.currentPage !== 1) {
                pagination.setPage(1);
            } else {
                loadData(true); // 필터 변경 시에는 통계도 함께 로딩
            }
        });
    }, [filters.search, filters.status, loadData, pagination.currentPage, pagination.setPage]);

    // 페이지 변경 시 데이터 로딩
    useEffect(() => {
        loadData(false);
    }, [loadData]);

    // 개별 카테고리 상태 변경
    const handleStatusChange = useCallback(async (categoryId: number, is_active: boolean) => {
        try {
            await categoryService.updateCategoryStatus(categoryId, is_active);
            // 상태 변경 후 즉시 UI 업데이트
            setCategories((prev) => prev.map((c) => (c.id === categoryId ? { ...c, is_active } : c)));
            // 통계도 즉시 업데이트
            setStats((prev) => ({
                ...prev,
                active: is_active ? prev.active + 1 : prev.active - 1,
                inactive: is_active ? prev.inactive - 1 : prev.inactive + 1,
            }));
        } catch (error) {
            console.error('상태 변경 실패:', error);
        }
    }, []);

    // 대량 상태 변경
    const handleBulkStatusChange = async (is_active: boolean) => {
        if (selectedCategories.length === 0) return;

        try {
            await categoryService.bulkUpdateStatus(selectedCategories, is_active);
            setSelectedCategories([]);
            loadData(true); // 통계도 함께 새로고침
        } catch (error) {
            console.error('대량 상태 변경 실패:', error);
        }
    };

    // 카테고리 삭제 처리
    const handleDeleteCategory = useCallback(
        async (categoryId: number) => {
            if (!confirm('정말로 이 카테고리를 삭제하시겠습니까?')) return;

            try {
                await categoryService.deleteCategory(categoryId);
                loadData(true); // 통계도 함께 새로고침
            } catch (error) {
                console.error('삭제 실패:', error);
            }
        },
        [loadData]
    );

    // 카테고리 생성 성공 핸들러
    const handleCreateSuccess = useCallback(() => {
        loadData(true); // 통계도 함께 새로고침
    }, [loadData]);

    // 순서 변경 성공 핸들러
    const handleSortSuccess = useCallback(() => {
        loadData(true); // 통계도 함께 새로고침
    }, [loadData]);

    // Table columns definition (memoized for performance)
    const columns: Column<Category>[] = useMemo(
        () => [
            {
                id: 'name',
                header: '카테고리명',
                cell: ({ row }) => (
                    <Badge variant="outline" className="text-gray-900">
                        {row.original.name}
                    </Badge>
                ),
            },
            {
                id: 'description',
                header: '설명',
                cell: ({ row }) => <div className="text-gray-600 max-w-xs text-sm truncate">{row.original.description || '-'}</div>,
            },
            {
                id: 'sort_order',
                header: '순서',
                cell: ({ row }) => (
                    <Badge variant="outline" className="font-mono">
                        {row.original.sort_order}
                    </Badge>
                ),
            },
            {
                id: 'status',
                header: '상태',
                cell: ({ row }) => (
                    <Badge variant={getCategoryStatusBadgeVariant(row.original.is_active)}>
                        {getCategoryStatusText(row.original.is_active)}
                    </Badge>
                ),
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
                    renderers.renderActions(row.original.id.toString(), row.original as unknown as Record<string, unknown>, [
                        {
                            type: 'status',
                            onClick: (id, data) => handleStatusChange(parseInt(id), !(data?.is_active as boolean)),
                            statusOptions: [
                                { value: 'true', label: '활성' },
                                { value: 'false', label: '비활성' },
                            ],
                        },
                        {
                            type: 'delete',
                            onClick: (id) => handleDeleteCategory(parseInt(id)),
                        },
                    ]),
            },
        ],
        [renderers, handleStatusChange, handleDeleteCategory]
    );

    return (
        <div className="space-y-6 p-5">
            {/* 통계 카드 */}
            <StatsCards
                stats={[
                    { id: 'total', label: '전체 카테고리', value: stats.total, variant: 'default' },
                    { id: 'active', label: '활성', value: stats.active, variant: 'success' },
                    { id: 'inactive', label: '비활성', value: stats.inactive, variant: 'secondary' },
                ]}
                columns={3}
                style="badge"
            />

            {/* Search & Filters */}
            <AdminCard>
                <FilterBar
                    commonFilters={{
                        search: {
                            placeholder: '카테고리 이름으로 검색',
                        },
                        status: {
                            options: [
                                { value: 'all', label: '전체' },
                                { value: 'active', label: '활성' },
                                { value: 'inactive', label: '비활성' },
                            ],
                        },
                    }}
                    onFilterChange={(newFilters) => {
                        setFilters({
                            search: newFilters.search || '',
                            status: (newFilters.status as 'all' | 'active' | 'inactive') || 'all',
                        });
                    }}
                    actions={
                        <div className="flex gap-2">
                            <Button onClick={() => setShowSortModal(true)} variant="outline" className="flex items-center gap-2">
                                <ArrowUpDown className="h-4 w-4" />
                                순서 변경
                            </Button>
                            <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />새 카테고리
                            </Button>
                        </div>
                    }
                />
            </AdminCard>

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
            <DataState loading={loading} error={error} data={categories} onRetry={() => loadData(true)}>
                <DataTable
                    data={categories}
                    columns={columns}
                    selectable={true}
                    selectedItems={selectedCategories.map(String)}
                    onSelectionChange={(selected) => setSelectedCategories(selected.map(Number))}
                    getRowId={(category: Category) => category.id.toString()}
                    totalCount={totalCategories}
                    totalLabel="카테고리"
                />
            </DataState>

            {/* Pagination */}
            <DefaultPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.setPage}
                className="mt-6"
            />

            {/* 카테고리 생성 모달 */}
            <CategoryCreateModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={handleCreateSuccess} />

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
