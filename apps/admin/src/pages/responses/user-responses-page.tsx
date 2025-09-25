import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { usePagination } from '@repo/shared';
import { DataTable, type Column, DefaultPagination, Badge } from '@repo/ui';
import { Download, Calendar, User, Clock, Monitor, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@repo/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui';
import {
	UserResponsesService,
	type UserResponse,
	type ResponseStats,
	type ResponseFilters,
	ResponseUtils,
} from '../../shared/api/services/user-responses.service';
import { DataState, FilterBar, StatsCards, BulkActions } from '../../components/ui';
import { useColumnRenderers } from '../../shared/hooks';
import { PAGINATION } from '../../shared/lib/constants';

interface FilterState {
	search: string;
	testId: string;
	category: string;
	device: string;
	dateFrom: string;
	dateTo: string;
}

export function UserResponsesPage() {
	const renderers = useColumnRenderers();

	const [responses, setResponses] = useState<UserResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedResponse, setSelectedResponse] = useState<UserResponse | null>(null);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
	const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const [filters, setFilters] = useState<FilterState>({
		search: '',
		testId: 'all',
		category: 'all',
		device: 'all',
		dateFrom: '',
		dateTo: '',
	});

	const pagination = usePagination({
		totalItems: totalCount,
		defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
	});

	// 통계 상태
	const [stats, setStats] = useState<ResponseStats>({
		total_responses: 0,
		completed_responses: 0,
		completion_rate: 0,
		avg_completion_time: 0,
		mobile_count: 0,
		desktop_count: 0,
		mobile_ratio: 0,
		stats_generated_at: new Date().toISOString(),
	});

	// API 호출을 위한 필터 변환
	const apiFilters: ResponseFilters = useMemo(() => {
		return {
			test_id: filters.testId === 'all' ? undefined : filters.testId,
			category_id: filters.category === 'all' ? undefined : filters.category,
			device_type: filters.device === 'all' ? undefined : filters.device,
			date_from: filters.dateFrom ? filters.dateFrom + 'T00:00:00Z' : undefined,
			date_to: filters.dateTo ? filters.dateTo + 'T23:59:59Z' : undefined,
			search_query: filters.search || undefined,
			limit: pagination.pageSize,
			offset: (pagination.currentPage - 1) * pagination.pageSize,
		};
	}, [filters, pagination.currentPage, pagination.pageSize]);

	// 데이터 로딩
	const loadData = useCallback(
		async (includeStats = false) => {
			setLoading(true);
			setError(null);

			try {
				// 응답 데이터 로딩
				const responsesData = await UserResponsesService.getResponses(apiFilters);
				setResponses(responsesData);
				setTotalCount(responsesData.length);

				// 통계 데이터 로딩 (필요한 경우만)
				if (includeStats) {
					try {
						const statsData = await UserResponsesService.getResponseStats(apiFilters);
						setStats(statsData);
					} catch (statsError) {
						console.warn('Failed to load stats:', statsError);
						// 통계 로딩 실패해도 메인 데이터는 표시
					}
				}
			} catch (err) {
				console.error('데이터 로딩 실패:', err);
				setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
				setResponses([]);
				setTotalCount(0);
			} finally {
				setLoading(false);
			}
		},
		[apiFilters]
	);

	// 필터 변경 시 첫 페이지로 이동하고 데이터 로딩 (초기 로딩 포함)
	useEffect(() => {
		loadData(true); // 통계도 함께 로딩
	}, [filters.search, filters.testId, filters.category, filters.device, filters.dateFrom, filters.dateTo, loadData]);

	// 개별 응답 삭제 처리 - 확인 후 삭제하고 목록 새로고침
	const handleDeleteResponse = useCallback(
		async (responseId: string) => {
			if (!confirm('정말로 이 응답을 삭제하시겠습니까?')) return;

			try {
				await UserResponsesService.deleteResponse(responseId);
				loadData(true); // 통계도 함께 새로고침
				setSuccessMessage('응답이 성공적으로 삭제되었습니다.');
				setTimeout(() => setSuccessMessage(null), 3000);
			} catch (error) {
				console.error('응답 삭제 실패:', error);
				setError(error instanceof Error ? error.message : '응답을 삭제하는데 실패했습니다.');
			}
		},
		[loadData]
	);

	// 대량 삭제
	const handleBulkDelete = useCallback(async () => {
		if (selectedResponses.length === 0) return;
		if (!confirm(`선택한 ${selectedResponses.length}개의 응답을 삭제하시겠습니까?`)) return;

		try {
			await Promise.all(selectedResponses.map((responseId) => UserResponsesService.deleteResponse(responseId)));
			setSelectedResponses([]);
			loadData(true); // 통계도 함께 새로고침
			setSuccessMessage(`${selectedResponses.length}개의 응답이 성공적으로 삭제되었습니다.`);
			setTimeout(() => setSuccessMessage(null), 3000);
		} catch (error) {
			console.error('대량 삭제 실패:', error);
			setError(error instanceof Error ? error.message : '대량 삭제에 실패했습니다.');
		}
	}, [selectedResponses, loadData]);

	// 데이터 내보내기
	const handleExport = useCallback(async () => {
		try {
			setLoading(true);
			const blob = await UserResponsesService.exportToCSV(apiFilters);
			const filename = `user-responses-${new Date().toISOString().split('T')[0]}.csv`;
			UserResponsesService.downloadFile(blob, filename);
			setSuccessMessage('데이터가 성공적으로 내보내졌습니다.');
			setTimeout(() => setSuccessMessage(null), 3000);
		} catch (err) {
			console.error('Failed to export data:', err);
			const errorMessage = err instanceof Error ? err.message : 'CSV 내보내기에 실패했습니다.';
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}, [apiFilters]);

	// Table columns definition (memoized for performance)
	const columns: Column<UserResponse>[] = useMemo(
		() => [
			{
				id: 'id',
				header: '응답 ID',
				cell: ({ row }) => <div className="font-mono text-xs text-gray-500">{row.original.id.slice(0, 8)}...</div>,
			},
			{
				id: 'test',
				header: '테스트',
				cell: ({ row }) => (
					<div className="min-w-0">
						<div className="font-medium text-gray-900 truncate">{row.original.test_title}</div>
						<div className="text-xs text-gray-500">{row.original.test_slug}</div>
					</div>
				),
			},
			{
				id: 'categories',
				header: '카테고리',
				cell: ({ row }) => (
					<div className="flex flex-wrap gap-1">
						{row.original.category_names.map((cat: string, index: number) => (
							<Badge key={index} variant="outline" className="text-xs">
								{cat}
							</Badge>
						))}
					</div>
				),
			},
			{
				id: 'result',
				header: '결과 유형',
				cell: ({ row }) => (
					<Badge variant="default" className="text-xs">
						{row.original.result_name || '결과 없음'}
					</Badge>
				),
			},
			{
				id: 'score',
				header: '점수',
				cell: ({ row }) => renderers.renderNumber(row.original.total_score),
			},
			{
				id: 'completed_at',
				header: '응답일시',
				cell: ({ row }) => renderers.renderDate(row.original.completed_at || ''),
			},
			{
				id: 'duration',
				header: '소요시간',
				cell: ({ row }) => (
					<span className="text-sm text-gray-900">
						{ResponseUtils.formatDuration(row.original.completion_time_seconds)}
					</span>
				),
			},
			{
				id: 'device',
				header: '디바이스',
				cell: ({ row }) => (
					<div className="flex items-center gap-1">
						<Monitor className="w-3 h-3 text-gray-400" />
						<span className="text-sm text-gray-900">{ResponseUtils.formatDeviceType(row.original.device_type)}</span>
					</div>
				),
			},
			{
				id: 'status',
				header: '상태',
				cell: ({ row }) => {
					const status = ResponseUtils.getResponseStatus(row.original);
					return (
						<Badge variant={status === 'completed' ? 'default' : 'secondary'} className="text-xs">
							{status === 'completed' ? '완료' : '미완료'}
						</Badge>
					);
				},
			},
			{
				id: 'actions',
				header: '액션',
				cell: ({ row }) =>
					renderers.renderActions(row.original.id, row.original as unknown as Record<string, unknown>, [
						{
							type: 'view',
							onClick: () => {
								setSelectedResponse(row.original);
								setIsDetailDialogOpen(true);
							},
						},
						{
							type: 'delete',
							onClick: (id) => handleDeleteResponse(id),
						},
					]),
			},
		],
		[renderers, handleDeleteResponse]
	);

	return (
		<div className="space-y-6 p-5">
			{/* 성공/에러 메시지 */}
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
			<StatsCards
				stats={[
					{
						id: 'total',
						label: '총 응답 수',
						value: stats.total_responses,
						icon: <User className="w-5 h-5" />,
						color: 'blue',
					},
					{
						id: 'completed',
						label: '완료율',
						value: stats.completion_rate,
						icon: <Clock className="w-5 h-5" />,
						color: 'green',
					},
					{
						id: 'avg_time',
						label: '평균 소요시간',
						value: stats.avg_completion_time,
						icon: <Calendar className="w-5 h-5" />,
						color: 'purple',
					},
					{
						id: 'mobile_ratio',
						label: '모바일 비율',
						value: stats.mobile_ratio,
						icon: <Monitor className="w-5 h-5" />,
						color: 'yellow',
					},
				]}
				columns={4}
			/>

			{/* Search & Filters */}
			<FilterBar
				filters={{
					search: true,
					date: true,
				}}
				values={{
					search: filters.search,
					device: filters.device,
					dateFrom: filters.dateFrom,
					dateTo: filters.dateTo,
				}}
				onFilterChange={(newFilters) => {
					setFilters({
						search: newFilters.search || '',
						testId: 'all',
						category: 'all',
						device: (newFilters.device as string) || 'all',
						dateFrom: newFilters.dateFrom || '',
						dateTo: newFilters.dateTo || '',
					});
				}}
				actions={
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => loadData(true)}
							disabled={loading}
							className="flex items-center gap-2"
						>
							<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
							새로고침
						</Button>
						<Button onClick={handleExport} className="flex items-center gap-2">
							<Download className="w-4 h-4" />
							데이터 내보내기
						</Button>
					</div>
				}
			/>

			{/* Bulk Actions */}
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

			{/* Response List */}
			<DataState loading={loading} error={error} data={responses} onRetry={() => loadData(true)}>
				<DataTable
					data={responses}
					columns={columns}
					selectable={true}
					selectedItems={selectedResponses}
					onSelectionChange={setSelectedResponses}
					getRowId={(response: UserResponse) => response.id}
					onRowClick={(response: UserResponse) => {
						setSelectedResponse(response);
						setIsDetailDialogOpen(true);
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

			{/* 응답 상세 다이얼로그 */}
			<Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
				<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>응답 상세 정보</DialogTitle>
					</DialogHeader>
					{selectedResponse && (
						<div className="space-y-6">
							{/* 기본 정보 */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-3">
									<h4 className="font-semibold text-lg border-b pb-2">기본 정보</h4>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">응답 ID:</span>
											<span className="font-mono text-xs">{selectedResponse.id}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">테스트:</span>
											<span className="text-right max-w-xs truncate">{selectedResponse.test_title}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">카테고리:</span>
											<div className="flex flex-wrap gap-1 max-w-xs">
												{selectedResponse.category_names.map((cat: string, index: number) => (
													<Badge key={index} variant="outline" className="text-xs">
														{cat}
													</Badge>
												))}
											</div>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">결과 유형:</span>
											<Badge variant="default" className="text-xs">
												{selectedResponse.result_name || '없음'}
											</Badge>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">점수:</span>
											<span className="font-semibold">{selectedResponse.total_score ?? 0}점</span>
										</div>
									</div>
								</div>

								<div className="space-y-3">
									<h4 className="font-semibold text-lg border-b pb-2">환경 정보</h4>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">디바이스:</span>
											<span>{ResponseUtils.formatDeviceType(selectedResponse.device_type)}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">IP 주소:</span>
											<span className="font-mono text-xs">{selectedResponse.ip_address || '알 수 없음'}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">User Agent:</span>
											<span className="text-xs max-w-xs truncate">
												{selectedResponse.user_agent ? selectedResponse.user_agent.slice(0, 30) + '...' : '알 수 없음'}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">리퍼러:</span>
											<span className="text-xs max-w-xs truncate">{selectedResponse.referrer || '직접 방문'}</span>
										</div>
									</div>
								</div>
							</div>

							{/* 시간 정보 */}
							<div className="space-y-3">
								<h4 className="font-semibold text-lg border-b pb-2">시간 정보</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div className="flex justify-between">
										<span className="font-medium text-gray-600">시작 시간:</span>
										<span>
											{selectedResponse.started_at
												? new Date(selectedResponse.started_at).toLocaleString('ko-KR')
												: '알 수 없음'}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="font-medium text-gray-600">완료 시간:</span>
										<span>
											{selectedResponse.completed_at
												? new Date(selectedResponse.completed_at).toLocaleString('ko-KR')
												: '미완료'}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="font-medium text-gray-600">소요 시간:</span>
										<span className="font-semibold">
											{ResponseUtils.formatDuration(selectedResponse.completion_time_seconds)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="font-medium text-gray-600">세션 ID:</span>
										<span className="font-mono text-xs">{selectedResponse.session_id}</span>
									</div>
								</div>
							</div>

							{/* 질문별 응답 */}
							<div className="space-y-3">
								<h4 className="font-semibold text-lg border-b pb-2">질문별 응답</h4>
								<div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
									<pre className="text-sm whitespace-pre-wrap font-mono">
										{JSON.stringify(selectedResponse.responses, null, 2)}
									</pre>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
