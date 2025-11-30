import React, { useCallback, useState, useMemo } from 'react';
import { usePagination } from '@pickid/shared';
import type { Feedback } from '@pickid/supabase';
import { DataTable, type Column, DefaultPagination, Badge, type BadgeProps } from '@pickid/ui';
import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { FeedbackDetailModal, FeedbackReplyModal } from '@/components/feedback';
import { useColumnRenderers } from '@/hooks/use-column-renderers';
import { useFeedbacks } from '@/hooks';
import {
	PAGINATION,
	FILTER_FEEDBACK_STATUS_OPTIONS,
	FILTER_FEEDBACK_CATEGORY_OPTIONS,
	FEEDBACK_STATUS_OPTIONS,
	FEEDBACK_CATEGORY_OPTIONS,
} from '@/constants';
import { getStatusConfig } from '@/utils/utils';

export function FeedbackListPage() {
	const renderers = useColumnRenderers();

	const {
		feedbacks,
		loading,
		filters,
		stats,
		updateFilters,
		updateStatus,
		bulkUpdateStatus,
		addReply,
		deleteFeedback,
	} = useFeedbacks();

	const [modalFeedback, setModalFeedback] = useState<Feedback | null>(null);
	const [showReplyModal, setShowReplyModal] = useState<string | null>(null);
	const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);

	const pagination = usePagination({
		totalItems: feedbacks.length,
		defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
	});

	const handleBulkStatusChange = useCallback(
		async (status: Feedback['status']) => {
			if (selectedFeedbacks.length === 0) return;
			await bulkUpdateStatus({ feedbackIds: selectedFeedbacks, status });
			setSelectedFeedbacks([]);
		},
		[selectedFeedbacks, bulkUpdateStatus]
	);

	const handleAddReply = useCallback(
		async (reply: string) => {
			if (!showReplyModal || !reply.trim()) return;
			await addReply({ id: showReplyModal, reply });
			setShowReplyModal(null);
		},
		[showReplyModal, addReply]
	);

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
				cell: ({ row }) => {
					const categoryLabel =
						FEEDBACK_CATEGORY_OPTIONS.find((option) => option.value === row.original.category)?.label ||
						row.original.category;

					return (
						<Badge variant="outline" className="whitespace-nowrap">
							{categoryLabel}
						</Badge>
					);
				},
			},
			{
				id: 'author',
				header: '작성자',
				cell: ({ row }) => renderers.renderAuthor(row.original.author_name || ''),
			},
			{
				id: 'status',
				header: '상태',
				cell: ({ row }) => {
					const statusConfig = getStatusConfig('feedback', row.original.status);
					const statusVariant = (('variant' in statusConfig ? statusConfig.variant : undefined) ||
						'default') as BadgeProps['variant'];
					const statusColor = statusConfig.color || '';
					const statusText = statusConfig.text || row.original.status;

					return (
						<Badge variant={statusVariant} className="whitespace-nowrap">
							<span className="flex items-center gap-1">{statusText}</span>
						</Badge>
					);
				},
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
				cell: ({ row }) => {
					const feedback = row.original;
					return renderers.renderActions(feedback.id, feedback, [
						{
							type: 'reply',
							onClick: () => setShowReplyModal(feedback.id),
							condition: (data) => !data.admin_reply,
						},
						{
							type: 'status',
							onClick: async () => {
								await updateStatus({
									id: feedback.id,
									status: feedback.status || 'pending',
								});
							},
							statusOptions: [...FEEDBACK_STATUS_OPTIONS],
						},
						{
							type: 'delete',
							onClick: async () => {
								if (!confirm('정말로 이 피드백을 삭제하시겠습니까?')) return;
								await deleteFeedback(feedback.id);
							},
						},
					]);
				},
			},
		],
		[renderers, updateStatus, deleteFeedback]
	);

	return (
		<div className="space-y-6 p-6">
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

			<DataState loading={loading} data={feedbacks}>
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

			<DefaultPagination
				currentPage={pagination.currentPage}
				totalPages={pagination.totalPages}
				onPageChange={pagination.setPage}
				className="mt-6"
			/>

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

			<FeedbackReplyModal isOpen={!!showReplyModal} onClose={() => setShowReplyModal(null)} onSubmit={handleAddReply} />
		</div>
	);
}
