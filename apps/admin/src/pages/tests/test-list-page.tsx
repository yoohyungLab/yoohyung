import { TestDetailModal } from '@/components/test/test-detail-modal';
import { AdminCard, BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { useColumnRenderers } from '@/shared/hooks';
import { PAGINATION } from '@/shared/lib/constants';
import { getTestStatusInfo, getTestTypeInfo } from '@/shared/lib/test-utils';
import { usePagination } from '@repo/shared';
import { Badge, Button, DataTable, DefaultPagination, type Column } from '@repo/ui';
import { Edit, Globe, Lock, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../api/category.service';
import { testService } from '../../api/test.service';
import type { Test, TestStatus, TestType } from '@repo/supabase';

export function TestListPage() {
    const renderers = useColumnRenderers();

    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTests, setSelectedTests] = useState<string[]>([]);
    const [totalTests, setTotalTests] = useState(0);
    const [selectedTest, setSelectedTest] = useState<Test | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [apiCategories, setApiCategories] = useState<{ name: string; is_active: boolean }[]>([]);
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

    // 통계 계산
    const stats = useMemo(
        () => ({
            total: tests.length,
            published: tests.length, // status 컬럼이 없으므로 모든 테스트를 published로 간주
            draft: 0, // status 컬럼이 없으므로 0
            scheduled: 0, // status 컬럼이 없으므로 0
            responses: tests.reduce((sum, test) => sum + (test.responseCount || 0), 0),
        }),
        [tests]
    );

    // 카테고리 목록 (API에서 가져온 데이터 사용)
    const categories = useMemo(() => {
        return apiCategories.filter((cat) => cat.is_active).map((cat) => ({ value: cat.name, label: cat.name }));
    }, [apiCategories]);

    // 카테고리 로딩
    const loadCategories = useCallback(async () => {
        try {
            const result = await categoryService.getCategories({ status: 'active' }, 1, 100);
            setApiCategories(result.categories);
        } catch (error) {
            console.error('카테고리 로딩 실패:', error);
        }
    }, []);

    // 데이터 로딩
    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await testService.getAllTests();
            setTests(data as Test[]);
            setTotalTests(data.length);
        } catch (error) {
            console.error('테스트 목록 로딩 실패:', error);
            setError(error instanceof Error ? error.message : '테스트 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    // 필터링된 데이터
    const filteredTests = useMemo(() => {
        return tests.filter((test) => {
            const matchesSearch =
                test.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                (test.description || '').toLowerCase().includes(filters.search.toLowerCase()) ||
                (test.category || '').toLowerCase().includes(filters.search.toLowerCase());

            // status 필터링 제거 (status 컬럼이 없음)
            const matchesStatus = true;

            // type 필터링 제거 (type 컬럼이 없음)
            const matchesType = true;

            const matchesCategory = filters.category === 'all' || (test.category || '') === filters.category;

            return matchesSearch && matchesStatus && matchesType && matchesCategory;
        });
    }, [tests, filters]);

    useEffect(() => {
        loadData();
        loadCategories();
    }, [loadData, loadCategories]);

    // 상태 변경 핸들러 (status 컬럼이 없으므로 UI만 업데이트)
    const handleTogglePublish = useCallback(async (testId: string, currentStatus: boolean) => {
        try {
            await testService.togglePublishStatus(testId, !currentStatus);
            // UI 상태만 업데이트 (실제 DB에는 status 컬럼이 없음)
            setTests((prev) =>
                prev.map((test) =>
                    test.id === testId
                        ? {
                              ...test,
                              status: !currentStatus ? 'published' : 'draft',
                              isPublished: !currentStatus,
                          }
                        : test
                )
            );
        } catch (error) {
            console.error('상태 변경 실패:', error);
        }
    }, []);

    // 삭제 핸들러
    const handleDelete = useCallback(
        async (testId: string) => {
            if (!confirm('정말로 이 테스트를 삭제하시겠습니까?')) return;

            try {
                await testService.deleteTest(testId);
                loadData();
            } catch (error) {
                console.error('테스트 삭제 실패:', error);
            }
        },
        [loadData]
    );

    // 대량 상태 변경 (UI만 업데이트)
    const handleBulkPublish = async (isPublished: boolean) => {
        if (selectedTests.length === 0) return;

        try {
            await Promise.all(selectedTests.map((testId) => testService.togglePublishStatus(testId, isPublished)));
            // UI 상태 업데이트
            setTests((prev) =>
                prev.map((test) =>
                    selectedTests.includes(test.id)
                        ? {
                              ...test,
                              status: isPublished ? 'published' : 'draft',
                              isPublished: isPublished,
                          }
                        : test
                )
            );
            setSelectedTests([]);
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
            loadData();
        } catch (error) {
            console.error('대량 삭제 실패:', error);
        }
    };

    // 테이블 컬럼 정의
    const columns: Column<Test>[] = useMemo(
        () => [
            {
                id: 'title',
                header: '테스트',
                cell: ({ row }) => (
                    <div
                        className="cursor-pointer min-w-0"
                        onClick={() => {
                            setSelectedTest(row.original);
                            setShowDetailModal(true);
                        }}
                    >
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
                    // status 컬럼이 없으므로 기본값으로 처리
                    const status = row.original.status || 'draft';
                    const statusInfo = getTestStatusInfo(status);
                    return (
                        <div>
                            <Badge variant="outline" className="text-xs">
                                {statusInfo.name}
                            </Badge>
                        </div>
                    );
                },
            },
            {
                id: 'completion_count',
                header: '완료수',
                cell: ({ row }) => <div className="text-sm font-medium">{row.original.completion_count || 0}</div>,
            },
            {
                id: 'share_count',
                header: '공유수',
                cell: ({ row }) => <div className="text-sm font-medium">{row.original.share_count || 0}</div>,
            },
            {
                id: 'actions',
                header: '액션',
                cell: ({ row }) => (
                    <div className="flex items-center gap-1">
                        <Link to={`/tests/${row.original.id}/edit`}>
                            <Button size="sm" variant="outline" title="수정">
                                <Edit className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePublish(row.original.id, row.original.isPublished || false);
                            }}
                            className={row.original.isPublished ? 'text-yellow-600' : 'text-green-600'}
                            title={row.original.isPublished ? '비공개로 전환' : '공개로 전환'}
                        >
                            {row.original.isPublished ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(row.original.id);
                            }}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            title="삭제"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ),
            },
        ],
        [handleTogglePublish, handleDelete]
    );

    return (
        <div className="space-y-6 p-5">
            {/* 통계 카드 */}
            <StatsCards
                stats={[
                    { id: 'total', label: '전체 테스트', value: stats.total, variant: 'default' },
                    { id: 'published', label: '공개', value: stats.published, variant: 'success' },
                    { id: 'draft', label: '초안', value: stats.draft, variant: 'secondary' },
                    { id: 'scheduled', label: '예약', value: stats.scheduled, variant: 'info' },
                    { id: 'responses', label: '총 응답', value: stats.responses, variant: 'warning' },
                ]}
                columns={5}
                style="badge"
            />

            {/* 필터 및 검색 */}
            <AdminCard>
                <FilterBar
                    commonFilters={{
                        search: {
                            placeholder: '테스트 제목, 설명, 카테고리로 검색',
                        },
                        category: {
                            options: [{ value: 'all', label: '전체 카테고리' }, ...categories],
                        },
                    }}
                    onFilterChange={(newFilters) => {
                        setFilters({
                            search: newFilters.search || '',
                            status: 'all', // status 필터 제거
                            type: 'all', // type 필터 제거
                            category: newFilters.category || 'all',
                        });
                    }}
                />
            </AdminCard>

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
            <DataState loading={loading} error={error} data={filteredTests} onRetry={loadData}>
                <DataTable
                    data={filteredTests}
                    columns={columns}
                    selectable={true}
                    selectedItems={selectedTests}
                    onSelectionChange={setSelectedTests}
                    getRowId={(test: Test) => test.id}
                    totalCount={filteredTests.length}
                    totalLabel="테스트"
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
            {showDetailModal && selectedTest && (
                <TestDetailModal
                    test={selectedTest}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedTest(null);
                    }}
                    onTogglePublish={async (testId: string, currentStatus: boolean) => {
                        await handleTogglePublish(testId, currentStatus);
                        // 모달에 표시된 테스트 정보도 업데이트
                        const updatedTest = tests.find((t) => t.id === testId);
                        if (updatedTest) {
                            setSelectedTest({
                                ...updatedTest,
                                status: !currentStatus ? 'published' : 'draft',
                                isPublished: !currentStatus,
                            });
                        }
                    }}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
