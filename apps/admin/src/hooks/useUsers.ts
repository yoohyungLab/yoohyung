import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services';
import { queryKeys } from '@/shared/lib/query-client';

interface IUserFilters {
	search?: string;
	status?: 'all' | 'active' | 'inactive' | 'deleted';
	provider?: 'all' | 'email' | 'google' | 'kakao';
}

export const useUsers = (initialFilters: IUserFilters = {}) => {
	const [filters, setFilters] = useState<IUserFilters>(initialFilters);
	const queryClient = useQueryClient();

	// 데이터 조회
	const usersQuery = useQuery({
		queryKey: queryKeys.users.all,
		queryFn: () => userService.getUsers(),
		staleTime: 2 * 60 * 1000,
	});

	// 필터링
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

	const statsQuery = useQuery({
		queryKey: queryKeys.users.stats(),
		queryFn: () => userService.getUserStats(),
		staleTime: 5 * 60 * 1000,
	});

	// 뮤테이션들
	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' | 'deleted' }) =>
			userService.updateUserStatus(id, status),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
	});

	const bulkUpdateMutation = useMutation({
		mutationFn: ({ userIds, status }: { userIds: string[]; status: 'active' | 'inactive' | 'deleted' }) =>
			Promise.all(userIds.map((id) => userService.updateUserStatus(id, status))),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => userService.deleteUser(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
	});

	const syncMutation = useMutation({
		mutationFn: () => userService.syncAuthUsersToPublic(),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
	});

	// 액션들
	const updateFilters = useCallback((newFilters: Partial<IUserFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	return {
		users: filteredUsers,
		loading: usersQuery.isLoading || statsQuery.isLoading,
		error: usersQuery.error?.message || statsQuery.error?.message || null,
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
		updateUserStatus: updateStatusMutation.mutateAsync,
		bulkUpdateStatus: bulkUpdateMutation.mutateAsync,
		deleteUser: deleteMutation.mutateAsync,
		syncUsers: syncMutation.mutateAsync,
		isSyncing: syncMutation.isPending,
	};
};
