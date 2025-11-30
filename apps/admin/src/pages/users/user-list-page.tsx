import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { UserDetailModal } from '@/components/user';
import { useUsers } from '@/hooks';
import { useColumnRenderers } from '@/hooks';
import { FILTER_USER_PROVIDER_OPTIONS, FILTER_USER_STATUS_OPTIONS } from '@/constants';
import { DataTable, type Column } from '@pickid/ui';
import { useCallback, useMemo, useState } from 'react';

export function UserListPage() {
	const renderers = useColumnRenderers();

	const { users, loading, filters, stats, updateFilters, updateUser, bulkUpdateUser, deleteUser, syncUser, isSyncing } =
		useUsers({
			search: '',
			status: 'all',
			provider: 'all',
		});

	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [modalUser, setModalUser] = useState<{ id: string; email: string; name?: string } | null>(null);

	const openModal = useCallback((user: { id: string; email: string; name?: string }) => {
		setModalUser(user);
	}, []);

	const closeModal = useCallback(() => {
		setModalUser(null);
	}, []);

	const clearSelection = useCallback(() => {
		setSelectedUsers([]);
	}, []);

	const handleStatusChange = useCallback(
		async (userId: string, newStatus: 'active' | 'inactive' | 'deleted') => {
			if (!newStatus) return;
			await updateUser({ id: userId, status: newStatus });
		},
		[updateUser]
	);

	const handleBulkStatusChange = useCallback(
		async (status: 'active' | 'inactive' | 'deleted') => {
			if (selectedUsers.length === 0 || !status) return;
			await bulkUpdateUser({ userIds: selectedUsers, status });
			clearSelection();
		},
		[selectedUsers, bulkUpdateUser, clearSelection]
	);

	const handleDeleteUser = useCallback(
		async (userId: string) => {
			if (!confirm('정말로 이 사용자를 탈퇴 처리하시겠습니까?')) return;
			await deleteUser(userId);
		},
		[deleteUser]
	);

	const handleUserClick = useCallback(
		(user: { id: string; email: string; name?: string }) => {
			openModal(user);
		},
		[openModal]
	);

	const columns: Column<{
		id: string;
		email: string;
		name?: string;
		provider?: string;
		status?: string;
		avatar_url?: string;
		created_at?: string;
	}>[] = useMemo(
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
				cell: ({ row }) =>
					renderers.renderNameWithAvatar(
						row.original.name || row.original.email?.split('@')[0] || 'Unknown',
						row.original.avatar_url
					),
			},
			{
				id: 'provider',
				header: '가입경로',
				cell: ({ row }) => renderers.renderProvider(row.original.provider || 'email'),
			},
			{
				id: 'status',
				header: '상태',
				cell: ({ row }) => {
					const status = row.original.status || 'active';
					return renderers.renderStatus(status as 'active' | 'inactive' | 'deleted');
				},
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
							onClick: (id: string) => {
								const currentStatus = row.original.status || 'active';
								const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
								handleStatusChange(id, newStatus as 'active' | 'inactive' | 'deleted');
							},
							statusOptions: [
								{ value: 'active', label: '활성' },
								{ value: 'inactive', label: '비활성' },
								{ value: 'deleted', label: '탈퇴' },
							],
						},
						{
							type: 'delete',
							onClick: (id: string) => handleDeleteUser(id),
						},
					]),
			},
		],
		[renderers, handleStatusChange, handleDeleteUser]
	);

	return (
		<div className="space-y-6 p-6">
			<StatsCards
				stats={[
					{ id: 'active', label: '활성 사용자', value: stats.active },
					{ id: 'inactive', label: '비활성', value: stats.inactive },
					{ id: 'deleted', label: '탈퇴', value: stats.deleted },
				]}
				columns={3}
			/>

			<FilterBar
				filters={{
					search: true,
					status: { options: [...FILTER_USER_STATUS_OPTIONS] },
					provider: { options: [...FILTER_USER_PROVIDER_OPTIONS] },
				}}
				values={{
					search: filters.search || '',
					status: filters.status || 'all',
					provider: filters.provider || 'all',
				}}
				onFilterChange={updateFilters}
			/>

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
				onClear={clearSelection}
			/>

			<DataState loading={loading} data={users}>
				<DataTable
					data={users}
					columns={columns}
					selectable={true}
					selectedItems={selectedUsers}
					onSelectionChange={setSelectedUsers}
					getRowId={(user: { id: string }) => user.id}
					onRowClick={handleUserClick}
				/>
			</DataState>

			{modalUser && <UserDetailModal user={modalUser as unknown as any} onClose={closeModal} />}
		</div>
	);
}
