import React, { useCallback, useState } from 'react';
import { usePagination } from '@repo/shared';
import { DefaultPagination } from '@repo/ui';
import { AlertCircle } from 'lucide-react';
import { useUserResponses } from '@/hooks';
import { DataState, BulkActions } from '@/components/ui';
import { ResponseDetailDialog, ResponseStatsCards, ResponseTable, ResponseFilters } from '@/components/response';
import { PAGINATION } from '@/shared/lib/constants';
import type { UserResponse } from '@/shared/api/services/user-responses.service';

export function UserResponsesPage() {
	// 커스텀 훅 사용
	const { responses, loading, error, filters, stats, deleteResponse, bulkDeleteResponses, exportToCSV, updateFilters } =
		useUserResponses();

	const [selectedResponse, setSelectedResponse] = useState<UserResponse | null>(null);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
	const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const pagination = usePagination({
		totalItems: responses.length,
		defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
	});

	// 응답 삭제
	const handleDeleteResponse = useCallback(
		async (responseId: string) => {
			if (!confirm('정말로 이 응답을 삭제하시겠습니까?')) return;
			await deleteResponse(responseId);
			setSuccessMessage('응답이 성공적으로 삭제되었습니다.');
			setTimeout(() => setSuccessMessage(null), 3000);
		},
		[deleteResponse]
	);

	// 대량 삭제
	const handleBulkDelete = useCallback(async () => {
		if (selectedResponses.length === 0) return;
		if (!confirm(`선택한 ${selectedResponses.length}개의 응답을 삭제하시겠습니까?`)) return;
		await bulkDeleteResponses(selectedResponses);
		setSelectedResponses([]);
		setSuccessMessage(`${selectedResponses.length}개의 응답이 성공적으로 삭제되었습니다.`);
		setTimeout(() => setSuccessMessage(null), 3000);
	}, [selectedResponses, bulkDeleteResponses]);

	// 데이터 내보내기
	const handleExport = useCallback(async () => {
		const success = await exportToCSV();
		if (success) {
			setSuccessMessage('데이터가 성공적으로 내보내졌습니다.');
			setTimeout(() => setSuccessMessage(null), 3000);
		}
	}, [exportToCSV]);

	// 응답 상세 보기
	const handleViewResponse = useCallback((response: UserResponse) => {
		setSelectedResponse(response);
		setIsDetailDialogOpen(true);
	}, []);

	// 응답 행 클릭
	const handleRowClick = useCallback(
		(response: UserResponse) => {
			handleViewResponse(response);
		},
		[handleViewResponse]
	);

	return (
		<div className="space-y-6 p-5">
			{/* 메시지 */}
			{error && (
				<div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
					<AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
					<div>
						<h4 className="text-sm font-medium text-red-800 mb-1">오류 발생</h4>
						<p className="text-sm text-red-700">{error}</p>
					</div>
				</div>
			)}

			{successMessage && (
				<div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
					<div className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">✓</div>
					<div>
						<h4 className="text-sm font-medium text-green-800 mb-1">성공</h4>
						<p className="text-sm text-green-700">{successMessage}</p>
					</div>
				</div>
			)}

			{/* 통계 카드 */}
			<ResponseStatsCards stats={stats} />

			{/* 필터 및 액션 */}
			<ResponseFilters filters={filters} loading={loading} onFilterChange={updateFilters} onExport={handleExport} />

			{/* 대량 액션 */}
			<BulkActions
				selectedCount={selectedResponses.length}
				actions={[
					{
						id: 'delete',
						label: '삭제',
						variant: 'destructive',
						onClick: handleBulkDelete,
					},
				]}
				onClear={() => setSelectedResponses([])}
			/>

			{/* 데이터 테이블 */}
			<DataState loading={loading} error={error} data={responses}>
				<ResponseTable
					responses={responses}
					selectedResponses={selectedResponses}
					onSelectionChange={setSelectedResponses}
					onRowClick={handleRowClick}
					onDelete={handleDeleteResponse}
					onView={handleViewResponse}
				/>
			</DataState>

			{/* 페이지네이션 */}
			<DefaultPagination
				currentPage={pagination.currentPage}
				totalPages={pagination.totalPages}
				onPageChange={pagination.setPage}
				className="mt-6"
			/>

			{/* 응답 상세 다이얼로그 */}
			<ResponseDetailDialog
				response={selectedResponse}
				isOpen={isDetailDialogOpen}
				onClose={() => setIsDetailDialogOpen(false)}
			/>
		</div>
	);
}
