import { BulkActions, DataState, FilterBar, StatsCards } from '@/components/ui';
import { UserDetailModal } from '@/components/user';
import { useUsers } from '@/hooks';
import { useTableColumns } from '@/hooks/useTableColumns';
import { USER_STATUSES, USER_PROVIDERS } from '@/constants';
import { DataTable } from '@pickid/ui';
import { useMemo, useState } from 'react';
import { toFilterOptions } from '@/utils/options';
import type { ExtendedUser } from '@/types/user.types';

export function UserListPage() {
	const { users, loading, filters, stats, updateFilters, updateUser, bulkUpdateUser, deleteUser } = useUsers({
		search: '',
		status: 'all',
		provider: 'all',
	});

	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [modalUser, setModalUser] = useState<ExtendedUser | null>(null);

	const handleBulkStatusChange = async (status: 'active' | 'inactive' | 'deleted') => {
		if (selectedUsers.length === 0 || !status) return;
		await bulkUpdateUser({ userIds: selectedUsers, status });
		setSelectedUsers([]);
	};

	const handleUserClick = (user: ExtendedUser) => {
		setModalUser(user);
	};

	const columnConfigs = useMemo(() => {
		const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'deleted') => {
			if (!newStatus) return;
			await updateUser({ id: userId, status: newStatus });
		};

		const handleDeleteUser = async (userId: string) => {
			if (!confirm('정말로 이 사용자를 탈퇴 처리하시겠습니까?')) return;
			await deleteUser(userId);
		};

		return [
			{
				id: 'email',
				header: '이메일',
				type: 'text' as const,
				accessor: 'email' as keyof ExtendedUser,
			},
			{
				id: 'name',
				header: '이름',
				type: 'custom' as const,
				customRender: (data: ExtendedUser) => {
					const email = 'email' in data ? (data.email as string | null) : null;
					return (
						<div className="flex items-center gap-2">
							{data.avatar_url && <img src={data.avatar_url} alt={data.name || ''} className="w-6 h-6 rounded-full" />}
							<span className="text-sm font-medium text-gray-900">
								{data.name || (email ? email.split('@')[0] : 'Unknown')}
							</span>
						</div>
					);
				},
			},
			{
				id: 'provider',
				header: '가입경로',
				type: 'text' as const,
				accessor: 'provider' as keyof ExtendedUser,
				format: (value: string) => {
					const providerLabels: Record<string, string> = {
						email: '이메일',
						google: '구글',
						kakao: '카카오',
					};
					return providerLabels[value || 'email'] || '이메일';
				},
			},
			{
				id: 'status',
				header: '상태',
				type: 'badge' as const,
				badge: {
					getValue: (data: ExtendedUser) => data.status || 'active',
					getVariant: (value: string) => {
						const statusKey = value as keyof typeof USER_STATUSES;
						return (USER_STATUSES[statusKey]?.variant || 'default') as
							| 'success'
							| 'outline'
							| 'info'
							| 'destructive'
							| 'default';
					},
					getLabel: (value: string) => {
						const statusKey = value as keyof typeof USER_STATUSES;
						return USER_STATUSES[statusKey]?.label || value;
					},
				},
			},
			{
				id: 'created_at',
				header: '가입일',
				type: 'date' as const,
				accessor: 'created_at' as keyof ExtendedUser,
			},
			{
				id: 'actions',
				header: '액션',
				type: 'actions' as const,
				actions: [
					{
						type: 'status' as const,
						onClick: async (id: string, data?: ExtendedUser) => {
							if (!data?.status) return;
							const currentStatus = data.status;
							const newStatus: 'active' | 'inactive' | 'deleted' =
								currentStatus === 'active' ? 'inactive' : currentStatus === 'inactive' ? 'deleted' : 'active';
							await handleStatusChange(id, newStatus);
						},
						statusOptions: [
							{ value: 'active', label: '활성' },
							{ value: 'inactive', label: '비활성' },
							{ value: 'deleted', label: '탈퇴' },
						],
					},
					{
						type: 'delete' as const,
						onClick: async (id: string) => {
							await handleDeleteUser(id);
						},
					},
				],
			},
		];
	}, [updateUser, deleteUser]);

	const { columns } = useTableColumns<ExtendedUser>(columnConfigs);

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
					status: { options: toFilterOptions(USER_STATUSES, '전체 상태') },
					provider: {
						options: [
							{ value: 'all', label: '전체 가입경로' },
							...Object.values(USER_PROVIDERS).map((p) => ({ value: p.value, label: p.label })),
						],
					},
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
				onClear={() => setSelectedUsers([])}
			/>

			<DataState loading={loading} data={users}>
				<DataTable
					data={users}
					columns={columns}
					selectable={true}
					selectedItems={selectedUsers}
					onSelectionChange={setSelectedUsers}
					getRowId={(user: ExtendedUser) => {
						const id = 'id' in user ? (user.id as string) : '';
						return id;
					}}
					onRowClick={handleUserClick}
				/>
			</DataState>

			{modalUser && (
				<UserDetailModal
					user={{
						...modalUser,
						activity: {
							total_responses: 0,
							unique_tests: 0,
							avg_completion_rate: 0,
							avg_duration_sec: 0,
							top_result_type: null,
							activity_score: 0,
						},
					}}
					onClose={() => setModalUser(null)}
				/>
			)}
		</div>
	);
}
