import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { UserDetailModal } from '@/components/user';
import { useUsers } from '@/hooks';
import { useColumnRenderers } from '@/shared/hooks';
import { FILTER_PROVIDER_OPTIONS, FILTER_STATUS_OPTIONS } from '@/shared/lib/constants';
import type { User } from '@pickid/supabase';
import { DataTable, type Column } from '@pickid/ui';
import { useCallback, useMemo, useState } from 'react';

export function UserListPage() {
	const renderers = useColumnRenderers();

	// 커스텀 훅 사용
	const {
		users,
		loading,
		error,
		filters,
		stats,
		updateUserStatus,
		bulkUpdateStatus,
		deleteUser,
		getUserById,
		updateFilters,
	} = useUsers();

	const [modalUser, setModalUser] = useState<User | null>(null);
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

	// 개별 사용자 상태 변경
	const handleStatusChange = useCallback(
		async (userId: string, newStatus: 'active' | 'inactive' | 'deleted') => {
			if (!newStatus) return;
			await updateUserStatus(userId, newStatus);
		},
		[updateUserStatus]
	);

	// 대량 상태 변경
	const handleBulkStatusChange = useCallback(
		async (status: 'active' | 'inactive' | 'deleted') => {
			if (selectedUsers.length === 0 || !status) return;
			await bulkUpdateStatus(selectedUsers, status);
			setSelectedUsers([]);
		},
		[selectedUsers, bulkUpdateStatus]
	);

	// 사용자 삭제 처리
	const handleDeleteUser = useCallback(
		async (userId: string) => {
			if (!confirm('정말로 이 사용자를 탈퇴 처리하시겠습니까?')) return;
			await deleteUser(userId);
		},
		[deleteUser]
	);

	// 사용자 상세 모달 열기
	const handleUserClick = useCallback(
		async (user: User) => {
			try {
				const userDetails = await getUserById(user.id);
				setModalUser(userDetails);
			} catch (error) {
				console.error('사용자 상세 정보 조회 실패:', error);
				// 실패 시 기본 사용자 정보로 모달 표시
				setModalUser(user);
			}
		},
		[getUserById]
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
			{/* 통계 카드 */}
			<StatsCards
				stats={[
					{ id: 'active', label: '활성 사용자', value: stats.active },
					{ id: 'inactive', label: '비활성', value: stats.inactive },
					{ id: 'deleted', label: '탈퇴', value: stats.deleted },
				]}
				columns={3}
			/>

			{/* 검색 및 필터 */}
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
				onFilterChange={updateFilters}
			/>

			{/* 대량 작업 */}
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

			{/* 사용자 목록 */}
			<DataState loading={loading} error={error} data={users}>
				<DataTable
					data={users}
					columns={columns}
					selectable={true}
					selectedItems={selectedUsers}
					onSelectionChange={setSelectedUsers}
					getRowId={(user: User) => user.id}
					onRowClick={handleUserClick}
				/>
			</DataState>

			{/* 사용자 상세 모달 */}
			{modalUser && <UserDetailModal user={modalUser} onClose={() => setModalUser(null)} />}
		</div>
	);
}
