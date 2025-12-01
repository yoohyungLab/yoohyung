import { FeedbackDetailModal, FeedbackReplyModal } from '@/components/feedback';
import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { PAGINATION, FEEDBACK_STATUSES, FEEDBACK_CATEGORIES, FEEDBACK_CATEGORY_OPTIONS } from '@/constants';
import { useFeedbacks } from '@/hooks';
import { useTableColumns } from '@/hooks/useTableColumns';
import { toOptions, toFilterOptions } from '@/utils/options';
import { usePagination } from '@pickid/shared';
import type { Feedback } from '@pickid/supabase';
import { DataTable, DefaultPagination } from '@pickid/ui';
import { FileText } from 'lucide-react';
import { useMemo, useState } from 'react';

export function FeedbackListPage() {
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
		defaultPageSize: PAGINATION.pageSize,
	});

	const handleBulkStatusChange = async (status: Feedback['status']) => {
		if (selectedFeedbacks.length === 0) return;
		await bulkUpdateStatus({ feedbackIds: selectedFeedbacks, status });
		setSelectedFeedbacks([]);
	};

	const handleAddReply = async (reply: string) => {
		if (!showReplyModal || !reply.trim()) return;
		await addReply({ id: showReplyModal, reply });
		setShowReplyModal(null);
	};

	const columnConfigs = useMemo(
		() => [
			{
				id: 'title',
				header: '제목',
				type: 'custom' as const,
				customRender: (data: Feedback) => (
					<div className="flex items-center gap-2">
						<div>
							<div className="font-medium text-gray-900">
								{data.title.length > 50 ? `${data.title.substring(0, 50)}...` : data.title}
							</div>
							<div className="text-sm text-gray-500">
								{data.content.length > 30 ? `${data.content.substring(0, 30)}...` : data.content}
							</div>
						</div>
						{data.attached_file_url && <FileText className="w-4 h-4 text-blue-500" />}
					</div>
				),
			},
			{
				id: 'category',
				header: '카테고리',
				type: 'badge' as const,
				badge: {
					getValue: (data: Feedback) => data.category || '',
					getLabel: (value: string) =>
						FEEDBACK_CATEGORY_OPTIONS.find((option) => option.value === value)?.label || value,
					getVariant: () => 'outline' as const,
				},
			},
			{
				id: 'author',
				header: '작성자',
				type: 'text' as const,
				accessor: 'author_name',
			},
			{
				id: 'status',
				header: '상태',
				type: 'badge' as const,
				badge: {
					getValue: (data: Feedback) => data.status || 'pending',
					getVariant: (value: string) => {
						const statusKey = value as keyof typeof FEEDBACK_STATUSES;
						const variant = FEEDBACK_STATUSES[statusKey]?.variant || 'default';
						return variant === 'warning' || variant === 'secondary' ? 'outline' : variant;
					},
					getLabel: (value: string) => {
						const statusKey = value as keyof typeof FEEDBACK_STATUSES;
						return FEEDBACK_STATUSES[statusKey]?.label || value;
					},
				},
			},
			{
				id: 'created_at',
				header: '작성일',
				type: 'date' as const,
				accessor: 'created_at',
			},
			{
				id: 'views',
				header: '조회수',
				type: 'number' as const,
				accessor: 'views',
			},
			{
				id: 'actions',
				header: '액션',
				type: 'actions' as const,
				actions: [
					{
						type: 'reply' as const,
						onClick: (id: string) => setShowReplyModal(id),
						condition: (data: Feedback) => !data.admin_reply,
					},
					{
						type: 'status' as const,
						onClick: async (id: string, data?: Feedback) => {
							await updateStatus({
								id,
								status: data?.status || 'pending',
							});
						},
						statusOptions: toOptions(FEEDBACK_STATUSES),
					},
					{
						type: 'delete' as const,
						onClick: async (id: string) => {
							if (!confirm('정말로 이 피드백을 삭제하시겠습니까?')) return;
							await deleteFeedback(id);
						},
					},
				],
			},
		],
		[updateStatus, deleteFeedback]
	);

	const { columns } = useTableColumns<Feedback>(columnConfigs);

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
						options: toFilterOptions(FEEDBACK_STATUSES, '전체 상태'),
					},
					category: {
						options: [
							{ value: 'all', label: '전체 카테고리' },
							...Object.values(FEEDBACK_CATEGORIES).map((c) => ({ value: c.value, label: c.label })),
						],
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
