import { queryKeys } from '@pickid/shared';
import { userService } from '@/services';
import { useToast } from '@pickid/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

interface IUserFilters {
	search?: string;
	status?: 'all' | 'active' | 'inactive' | 'deleted';
	provider?: 'all' | 'email' | 'google' | 'kakao';
}

export const useUsers = (initialFilters: IUserFilters = {}) => {
	const [filters, setFilters] = useState<IUserFilters>(initialFilters);
	const queryClient = useQueryClient();
	const toast = useToast();

	const usersQuery = useQuery({
		queryKey: queryKeys.users.all,
		queryFn: () => userService.getUsers(),
		staleTime: 2 * 60 * 1000,
	});

	const statsQuery = useQuery({
		queryKey: queryKeys.users.stats(),
		queryFn: () => userService.getUserStats(),
		staleTime: 5 * 60 * 1000,
	});

	const filteredUsers = useMemo(() => {
		const users = usersQuery.data || [];
		return users.filter((user) => {
			const matchesSearch =
				!filters.search ||
				user.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
				user.name?.toLowerCase().includes(filters.search.toLowerCase());
			const matchesStatus = !filters.status || filters.status === 'all' || user.status === filters.status;
			const matchesProvider = !filters.provider || filters.provider === 'all' || user.provider === filters.provider;
			return matchesSearch && matchesStatus && matchesProvider;
		});
	}, [usersQuery.data, filters]);

	const updateUserMutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' | 'deleted' }) =>
			userService.updateUserStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
			toast.success('사용자 상태가 변경되었습니다.');
		},
	});

	const bulkUpdateUserMutation = useMutation({
		mutationFn: ({ userIds, status }: { userIds: string[]; status: 'active' | 'inactive' | 'deleted' }) =>
			Promise.all(userIds.map((id) => userService.updateUserStatus(id, status))),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
			toast.success('대량 상태 변경이 완료되었습니다.');
		},
	});

	const deleteUserMutation = useMutation({
		mutationFn: (id: string) => userService.deleteUser(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
			toast.success('사용자가 삭제되었습니다.');
		},
	});

	const syncUserMutation = useMutation({
		mutationFn: () => userService.syncAuthUsersToPublic(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
			toast.success('사용자 동기화가 완료되었습니다.');
		},
	});

	const updateFilters = useCallback((newFilters: Partial<IUserFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	return {
		users: filteredUsers,
		loading: usersQuery.isLoading || statsQuery.isLoading,
		stats: statsQuery.data || {
			total: 0,
			active: 0,
			inactive: 0,
			deleted: 0,
			today: 0,
			this_week: 0,
			this_month: 0,
			email_signups: 0,
			google_signups: 0,
			kakao_signups: 0,
		},
		filters,
		updateFilters,
		updateUser: updateUserMutation.mutateAsync,
		bulkUpdateUser: bulkUpdateUserMutation.mutateAsync,
		deleteUser: deleteUserMutation.mutateAsync,
		syncUser: syncUserMutation.mutateAsync,
	};
};

