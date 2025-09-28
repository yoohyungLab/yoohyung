import React, { useCallback, useState, useMemo } from 'react';
import { usePagination } from '@repo/shared';
import type { Feedback } from '@repo/supabase';
import { DataTable, type Column, DefaultPagination, Badge } from '@repo/ui';
import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { FeedbackDetailModal, FeedbackReplyModal } from '@/components/feedback';
import { useColumnRenderers } from '@/shared/hooks';
import { useFeedbacks } from '@/hooks';
import {
	PAGINATION,
	FILTER_FEEDBACK_STATUS_OPTIONS,
	FILTER_FEEDBACK_CATEGORY_OPTIONS,
	FEEDBACK_STATUS_OPTIONS,
} from '@/shared/lib/constants';
import { getStatusText, getCategoryText, getStatusBadgeVariant, getFeedbackStatusStyle } from '@/shared/lib/utils';

export function FeedbackListPage() {
	const renderers = useColumnRenderers();

	// 커스텀 훅 사용
	const {
		feedbacks,
		loading,
		error,
		filters,
		stats,
		updateFeedbackStatus,
		bulkUpdateStatus,
		addAdminReply,
		deleteFeedback,

		updateFilters,
	} = useFeedbacks();

	const [modalFeedback, setModalFeedback] = useState<Feedback | null>(null);
	const [showReplyModal, setShowReplyModal] = useState<string | null>(null);
	const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);

	const pagination = usePagination({
		totalItems: feedbacks.length,
		defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
	});

	// 개별 피드백 상태 변경
	const handleStatusChange = useCallback(
		async (feedbackId: string, newStatus: Feedback['status']) => {
			await updateFeedbackStatus(feedbackId, newStatus);
		},
		[updateFeedbackStatus]
	);

	// 대량 상태 변경
	const handleBulkStatusChange = useCallback(
		async (status: Feedback['status']) => {
			if (selectedFeedbacks.length === 0) return;
			await bulkUpdateStatus(selectedFeedbacks, status);
			setSelectedFeedbacks([]);
		},
		[selectedFeedbacks, bulkUpdateStatus]
	);

	// 피드백 삭제 처리
	const handleDeleteFeedback = useCallback(
		async (feedbackId: string) => {
			if (!confirm('정말로 이 피드백을 삭제하시겠습니까?')) return;
			await deleteFeedback(feedbackId);
		},
		[deleteFeedback]
	);

	// 답변 추가 핸들러
	const handleAddReply = useCallback(
		async (reply: string) => {
			if (!showReplyModal || !reply.trim()) return;
			await addAdminReply(showReplyModal, reply);
			setShowReplyModal(null);
		},
		[showReplyModal, addAdminReply]
	);

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
				cell: ({ row }) => renderers.renderAuthor(row.original.author_name || ''),
			},
			{
				id: 'status',
				header: '상태',
				cell: ({ row }) => (
					<Badge
						variant={getStatusBadgeVariant(row.original.status)}
						className={`h-6 border ${getFeedbackStatusStyle(row.original.status)}`}
					>
						<span className="flex items-center gap-1">{getStatusText(row.original.status)}</span>
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
							statusOptions: [...FEEDBACK_STATUS_OPTIONS],
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
					{ id: 'total', label: '전체', value: stats.total },
					{ id: 'pending', label: '검토중', value: stats.pending },
					{ id: 'in_progress', label: '진행중', value: stats.in_progress },
					{ id: 'completed', label: '완료', value: stats.completed },
					{ id: 'replied', label: '답변완료', value: stats.replied },
					{ id: 'rejected', label: '반려', value: stats.rejected },
				]}
				columns={6}
			/>

			{/* Search & Filters */}
			<FilterBar
				filters={{
					search: true,
					status: {
						options: [...FILTER_FEEDBACK_STATUS_OPTIONS],
					},
					category: {
						options: [...FILTER_FEEDBACK_CATEGORY_OPTIONS],
					},
				}}
				values={{
					search: filters.search || '',
					status: filters.status || 'all',
					category: filters.category || 'all',
				}}
				onFilterChange={updateFilters}
			/>

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
			<DataState loading={loading} error={error} data={feedbacks}>
				<DataTable
					data={feedbacks}
					columns={columns}
					selectable={true}
					selectedItems={selectedFeedbacks}
					onSelectionChange={setSelectedFeedbacks}
					getRowId={(feedback: Feedback) => feedback.id}
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
