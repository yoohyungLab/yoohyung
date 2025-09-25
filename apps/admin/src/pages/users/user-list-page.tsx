import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { UserDetailModal } from '@/components/user';
import { useUsers } from '@/hooks';
import { useColumnRenderers } from '@/shared/hooks';
import { FILTER_PROVIDER_OPTIONS, FILTER_STATUS_OPTIONS, PAGINATION } from '@/shared/lib/constants';
import { usePagination } from '@repo/shared';
import type { User, UserFilters } from '@repo/supabase';
import { DataTable, DefaultPagination, type Column } from '@repo/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function UserListPage() {
	const renderers = useColumnRenderers();

	// 커스텀 훅 사용
	const {
		users,
		loading,
		error,
		totalUsers,
		stats,
		fetchUsers,
		updateUserStatus,
		bulkUpdateStatus,
		deleteUser,
		getUserDetails,
	} = useUsers();

	const [modalUser, setModalUser] = useState<User | null>(null);
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [filters, setFilters] = useState<UserFilters>({
		search: '',
		status: 'all',
		provider: 'all',
	});
	const pagination = usePagination({
		totalItems: totalUsers,
		defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
	});

	// 필터 변경 시 데이터 로딩
	const loadData = useCallback(async () => {
		const apiFilters = {
			search: filters.search || undefined,
			status: filters.status !== 'all' ? (filters.status as 'active' | 'inactive' | 'deleted') : undefined,
			provider: filters.provider !== 'all' ? (filters.provider as 'email' | 'kakao' | 'google') : undefined,
		};

		await fetchUsers(apiFilters, pagination.currentPage, pagination.pageSize);
	}, [filters.search, filters.status, filters.provider, pagination.currentPage, pagination.pageSize, fetchUsers]);

	// 필터나 페이지 변경 시 데이터 로딩
	useEffect(() => {
		loadData();
	}, [loadData]);

	// 개별 사용자 상태 변경
	const handleStatusChange = useCallback(
		async (userId: string, newStatus: 'active' | 'inactive' | 'deleted') => {
			if (!newStatus) return;
			await updateUserStatus(userId, newStatus);
		},
		[updateUserStatus]
	);

	// 대량 상태 변경
	const handleBulkStatusChange = async (status: 'active' | 'inactive' | 'deleted') => {
		if (selectedUsers.length === 0 || !status) return;
		await bulkUpdateStatus(selectedUsers, status);
		setSelectedUsers([]);
	};

	// 사용자 탈퇴 처리
	const handleDeleteUser = useCallback(
		async (userId: string) => {
			if (!confirm('정말로 이 사용자를 탈퇴 처리하시겠습니까?')) return;
			await deleteUser(userId);
		},
		[deleteUser]
	);

	// Table columns definition (memoized for performance)
	const columns: Column<User>[] = useMemo(
		() => [
			{
				id: 'email',
				header: '이메일',
				accessorKey: 'email',
				cell: ({ row }) => renderers.renderEmail(row.original.email || ''),
			},
			{
				id: 'name',
				header: '이름',
				cell: ({ row }) => renderers.renderNameWithAvatar(row.original.name || '', row.original.avatar_url),
			},
			{
				id: 'provider',
				header: '가입경로',
				cell: ({ row }) => renderers.renderProvider(row.original.provider || 'email'),
			},
			{
				id: 'status',
				header: '상태',
				cell: ({ row }) => renderers.renderStatus(row.original.status || 'active'),
			},
			{
				id: 'created_at',
				header: '가입일',
				cell: ({ row }) => renderers.renderDate(row.original.created_at || ''),
			},
			{
				id: 'actions',
				header: '액션',
				cell: ({ row }) =>
					renderers.renderActions(row.original.id, row.original as unknown as Record<string, unknown>, [
						{
							type: 'status',
							onClick: (id, data) =>
								handleStatusChange(id, (data?.status as 'active' | 'inactive' | 'deleted') || 'active'),
						},
						{
							type: 'delete',
							onClick: (id) => handleDeleteUser(id),
						},
					]),
			},
		],
		[renderers, handleStatusChange, handleDeleteUser]
	);

	return (
		<div className="space-y-6 p-5">
			{/* 간단한 통계 */}
			<StatsCards
				stats={[
					{ id: 'active', label: '활성 사용자', value: stats.active },
					{ id: 'inactive', label: '비활성', value: stats.inactive },
					{ id: 'deleted', label: '탈퇴', value: stats.deleted },
				]}
				columns={3}
			/>

			{/* Search & Filters */}
			<FilterBar
				filters={{
					search: true,
					status: {
						options: [...FILTER_STATUS_OPTIONS],
					},
					provider: {
						options: [...FILTER_PROVIDER_OPTIONS],
					},
				}}
				values={{
					search: filters.search || '',
					status: filters.status || 'all',
					provider: filters.provider || 'all',
				}}
				onFilterChange={(newFilters) => {
					setFilters({
						search: newFilters.search || '',
						status: (newFilters.status as 'all' | 'active' | 'inactive' | 'deleted') || 'all',
						provider: (newFilters.provider as 'all' | 'email' | 'google' | 'kakao') || 'all',
					});
				}}
			/>

			{/* Bulk Actions */}
			<BulkActions
				selectedCount={selectedUsers.length}
				actions={[
					{
						id: 'activate',
						label: '활성화',
						onClick: () => handleBulkStatusChange('active'),
					},
					{
						id: 'deactivate',
						label: '비활성화',
						onClick: () => handleBulkStatusChange('inactive'),
					},
					{
						id: 'delete',
						label: '탈퇴 처리',
						variant: 'destructive',
						onClick: () => handleBulkStatusChange('deleted'),
					},
				]}
				onClear={() => setSelectedUsers([])}
			/>

			{/* User List */}
			<DataState loading={loading} error={error} data={users} onRetry={loadData}>
				<DataTable
					data={users}
					columns={columns}
					selectable={true}
					selectedItems={selectedUsers}
					onSelectionChange={setSelectedUsers}
					getRowId={(user: User) => user.id}
					onRowClick={async (user: User) => {
						try {
							// 사용자 상세 정보를 가져와서 모달에 전달
							const userWithActivity = await getUserDetails(user.id);
							setModalUser(userWithActivity);
						} catch (error) {
							console.error('사용자 상세 정보 조회 실패:', error);
							// 실패 시 기본 사용자 정보로 모달 표시
							setModalUser(user);
						}
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

			{/* User Detail Modal */}
			{modalUser && <UserDetailModal user={modalUser} onClose={() => setModalUser(null)} />}
		</div>
	);
}
