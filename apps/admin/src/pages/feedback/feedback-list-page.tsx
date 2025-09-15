import React, { useCallback, useEffect, useState, useMemo, startTransition } from 'react';
import { usePagination } from '@repo/shared';
import { feedbackService } from '../../api/feedback.service';
import type { Feedback, FeedbackFilters } from '@repo/supabase/types';
import { DataTable, type Column, DefaultPagination, Badge } from '@repo/ui';
import { AdminCard, BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { FeedbackDetailModal, FeedbackReplyModal } from '@/components/feedback';
import { useColumnRenderers } from '@/shared/hooks';
import {
    PAGINATION,
    FILTER_FEEDBACK_STATUS_OPTIONS,
    FILTER_FEEDBACK_CATEGORY_OPTIONS,
    SEARCH_PLACEHOLDERS,
    FEEDBACK_CATEGORY_LABELS,
    FEEDBACK_STATUS_OPTIONS,
} from '@/shared/lib/constants';
import { getStatusText, getCategoryText, getStatusBadgeVariant } from '@/shared/lib/utils';

export function FeedbackListPage() {
    const renderers = useColumnRenderers();

    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalFeedback, setModalFeedback] = useState<Feedback | null>(null);
    const [showReplyModal, setShowReplyModal] = useState<string | null>(null);
    const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        category: 'all',
    });
    const pagination = usePagination({
        totalItems: totalFeedbacks,
        defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    });

    // 간단한 통계
    const [stats, setStats] = useState({
        pending: 0,
        in_progress: 0,
        completed: 0,
        replied: 0,
        rejected: 0,
    });

    // 모든 데이터를 한번에 로딩
    const loadData = useCallback(
        async (includeStats = false) => {
            setLoading(true);
            setError(null);

            try {
                const apiFilters: FeedbackFilters = {
                    search: filters.search || undefined,
                    status: filters.status !== 'all' ? (filters.status as Feedback['status']) : undefined,
                    category: filters.category !== 'all' ? (filters.category as keyof typeof FEEDBACK_CATEGORY_LABELS) : undefined,
                };

                // 피드백 데이터 로딩
                const feedbackResult = await feedbackService.getFeedbacks(apiFilters, pagination.currentPage, pagination.pageSize);
                setFeedbacks(feedbackResult.feedbacks);
                setTotalFeedbacks(feedbackResult.total);

                // 통계 데이터 로딩
                if (includeStats) {
                    const statsResult = await feedbackService.getFeedbackStats();
                    setStats({
                        pending: statsResult.pending,
                        in_progress: statsResult.in_progress,
                        completed: statsResult.completed,
                        replied: statsResult.replied,
                        rejected: statsResult.rejected,
                    });
                }
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
                setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        },
        [filters.search, filters.status, filters.category, pagination.currentPage, pagination.pageSize]
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search, filters.status, filters.category]);

    // 초기 로딩 및 페이지 변경 시 데이터 로딩
    useEffect(() => {
        loadData(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.currentPage, pagination.pageSize]);

    // 개별 피드백 상태 변경 - 서버 요청 후 즉시 UI 업데이트
    const handleStatusChange = useCallback(
        async (feedbackId: string, newStatus: Feedback['status']) => {
            try {
                await feedbackService.updateFeedbackStatus(feedbackId, newStatus);
                // 상태 변경 후 즉시 UI 업데이트
                setFeedbacks((prev) => prev.map((f) => (f.id === feedbackId ? { ...f, status: newStatus } : f)));
                // 통계도 즉시 업데이트
                setStats((prev) => ({
                    ...prev,
                    [newStatus]: prev[newStatus] + 1,
                    [feedbacks.find((f) => f.id === feedbackId)?.status || 'pending']:
                        prev[feedbacks.find((f) => f.id === feedbackId)?.status || 'pending'] - 1,
                }));
            } catch (error) {
                console.error('상태 변경 실패:', error);
            }
        },
        [feedbacks]
    );

    // 대량 상태 변경 - 선택된 여러 피드백 상태를 한번에 변경
    const handleBulkStatusChange = async (status: Feedback['status']) => {
        if (selectedFeedbacks.length === 0) return;

        try {
            await feedbackService.bulkUpdateStatus(selectedFeedbacks, status);
            setSelectedFeedbacks([]);
            loadData(true); // 통계도 함께 새로고침
        } catch (error) {
            console.error('대량 상태 변경 실패:', error);
        }
    };

    // 피드백 삭제 처리 - 확인 후 삭제하고 목록 새로고침
    const handleDeleteFeedback = useCallback(
        async (feedbackId: string) => {
            if (!confirm('정말로 이 피드백을 삭제하시겠습니까?')) return;

            try {
                await feedbackService.deleteFeedback(feedbackId);
                loadData(true); // 통계도 함께 새로고침
            } catch (error) {
                console.error('삭제 처리 실패:', error);
            }
        },
        [loadData]
    );

    // 답변 추가 핸들러
    const handleAddReply = async (reply: string) => {
        if (!showReplyModal || !reply.trim()) return;

        try {
            await feedbackService.addAdminReply(showReplyModal, reply);
            setShowReplyModal(null);
            loadData(true); // 통계도 함께 새로고침
        } catch (error) {
            console.error('답변 추가 실패:', error);
            setError(error instanceof Error ? error.message : '답변 추가에 실패했습니다.');
        }
    };

    // Table columns definition (memoized for performance)
    const columns: Column<Feedback>[] = useMemo(
        () => [
            {
                id: 'title',
                header: '제목',
                accessorKey: 'title',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        {renderers.renderTitleWithContent(row.original.title, row.original.content)}
                        {renderers.renderFileAttachment(row.original.attached_file_url)}
                    </div>
                ),
            },
            {
                id: 'category',
                header: '카테고리',
                cell: ({ row }) => (
                    <Badge variant="outline" className="h-6">
                        {getCategoryText(row.original.category)}
                    </Badge>
                ),
            },
            {
                id: 'author',
                header: '작성자',
                cell: ({ row }) => renderers.renderAuthor(row.original.author_name),
            },
            {
                id: 'status',
                header: '상태',
                cell: ({ row }) => (
                    <Badge variant={getStatusBadgeVariant(row.original.status)} className="h-6">
                        {getStatusText(row.original.status)}
                    </Badge>
                ),
            },
            {
                id: 'created_at',
                header: '작성일',
                cell: ({ row }) => renderers.renderDate(row.original.created_at),
            },
            {
                id: 'views',
                header: '조회수',
                cell: ({ row }) => renderers.renderNumber(row.original.views),
            },
            {
                id: 'actions',
                header: '액션',
                cell: ({ row }) =>
                    renderers.renderActions(row.original.id, row.original as unknown as Record<string, unknown>, [
                        {
                            type: 'reply',
                            onClick: (id) => setShowReplyModal(id),
                            condition: (data) => !data.admin_reply,
                        },
                        {
                            type: 'status',
                            onClick: (id, data) => handleStatusChange(id, (data?.status as Feedback['status']) || 'pending'),
                            statusOptions: FEEDBACK_STATUS_OPTIONS as Array<{ value: string; label: string }>,
                        },
                        {
                            type: 'delete',
                            onClick: (id) => handleDeleteFeedback(id),
                        },
                    ]),
            },
        ],
        [renderers, handleStatusChange, handleDeleteFeedback]
    );

    return (
        <div className="space-y-6 p-5">
            {/* 간단한 통계 */}
            <StatsCards
                stats={[
                    { id: 'pending', label: '검토중', value: stats.pending, variant: 'warning' },
                    { id: 'in_progress', label: '진행중', value: stats.in_progress, variant: 'info' },
                    { id: 'completed', label: '완료', value: stats.completed, variant: 'success' },
                    { id: 'replied', label: '답변완료', value: stats.replied, variant: 'secondary' },
                    { id: 'rejected', label: '반려', value: stats.rejected, variant: 'destructive' },
                ]}
                columns={5}
                style="badge"
            />

            {/* Search & Filters */}
            <AdminCard>
                <FilterBar
                    commonFilters={{
                        search: {
                            placeholder: SEARCH_PLACEHOLDERS.FEEDBACK,
                        },
                        status: {
                            options: FILTER_FEEDBACK_STATUS_OPTIONS,
                        },
                        category: {
                            options: FILTER_FEEDBACK_CATEGORY_OPTIONS,
                        },
                    }}
                    onFilterChange={(newFilters) => {
                        setFilters({
                            search: newFilters.search || '',
                            status: newFilters.status || 'all',
                            category: newFilters.category || 'all',
                        });
                    }}
                />
            </AdminCard>

            {/* Bulk Actions */}
            <BulkActions
                selectedCount={selectedFeedbacks.length}
                actions={[
                    {
                        id: 'in_progress',
                        label: '진행중으로',
                        onClick: () => handleBulkStatusChange('in_progress'),
                    },
                    {
                        id: 'completed',
                        label: '완료로',
                        onClick: () => handleBulkStatusChange('completed'),
                    },
                    {
                        id: 'rejected',
                        label: '반려',
                        variant: 'destructive',
                        onClick: () => handleBulkStatusChange('rejected'),
                    },
                ]}
                onClear={() => setSelectedFeedbacks([])}
            />

            {/* Feedback List */}
            <DataState loading={loading} error={error} data={feedbacks} onRetry={() => loadData(true)}>
                <DataTable
                    data={feedbacks}
                    columns={columns}
                    selectable={true}
                    selectedItems={selectedFeedbacks}
                    onSelectionChange={setSelectedFeedbacks}
                    getRowId={(feedback: Feedback) => feedback.id}
                    totalCount={totalFeedbacks}
                    totalLabel="건의사항"
                    onRowClick={(feedback: Feedback) => {
                        setModalFeedback(feedback);
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

            {/* 피드백 상세 모달 */}
            {modalFeedback && (
                <FeedbackDetailModal
                    feedback={modalFeedback}
                    onClose={() => setModalFeedback(null)}
                    onReply={(id) => {
                        setModalFeedback(null);
                        setShowReplyModal(id);
                    }}
                />
            )}

            {/* 답변 모달 */}
            <FeedbackReplyModal isOpen={!!showReplyModal} onClose={() => setShowReplyModal(null)} onSubmit={handleAddReply} />
        </div>
    );
}
