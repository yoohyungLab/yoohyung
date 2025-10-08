import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/shared/api';
import { queryKeys } from '@/shared/lib/query-client';
import type { User, UserFilters } from '@pickid/supabase';

// 사용자 목록 조회 쿼리
export const useUsersQuery = (filters: UserFilters = {}) => {
	return useQuery({
		queryKey: queryKeys.users.list(filters as Record<string, unknown>),
		queryFn: () => userService.getUsers(),
		select: (data) => {
			// 클라이언트 사이드 필터링
			return data.filter((user) => {
				const matchesSearch =
					!filters.search ||
					user.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
					user.name?.toLowerCase().includes(filters.search.toLowerCase());
				const matchesStatus = filters.status === 'all' || user.status === filters.status;
				const matchesProvider = filters.provider === 'all' || user.provider === filters.provider;
				return matchesSearch && matchesStatus && matchesProvider;
			});
		},
		staleTime: 2 * 60 * 1000, // 2분
		gcTime: 5 * 60 * 1000, // 5분
	});
};

// 사용자 상세 조회 쿼리
export const useUser = (id: string) => {
	return useQuery({
		queryKey: queryKeys.users.detail(id),
		queryFn: () => userService.getUserById(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 10 * 60 * 1000, // 10분
	});
};

// 사용자 통계 조회 쿼리
export const useUserStats = () => {
	return useQuery({
		queryKey: queryKeys.users.stats(),
		queryFn: () => userService.getUserStats(),
		staleTime: 5 * 60 * 1000, // 5분
		gcTime: 10 * 60 * 1000, // 10분
	});
};

// 사용자 생성 뮤테이션
export const useCreateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userData: { email: string; name?: string; avatar_url?: string; provider?: string; status?: string }) =>
			userService.createUser(userData),
		onSuccess: () => {
			// 사용자 목록과 통계 캐시 무효화
			queryClient.invalidateQueries({
				queryKey: queryKeys.users.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.users.stats(),
			});
		},
	});
};

// 사용자 수정 뮤테이션
export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) => userService.updateUser(id, updates),
		onSuccess: (updatedUser) => {
			// 해당 사용자 캐시 업데이트
			queryClient.setQueryData(queryKeys.users.detail(updatedUser.id), updatedUser);

			// 사용자 목록과 통계 캐시 무효화
			queryClient.invalidateQueries({
				queryKey: queryKeys.users.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.users.stats(),
			});
		},
	});
};

// 사용자 상태 변경 뮤테이션
export const useUpdateUserStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' | 'deleted' }) =>
			userService.updateUserStatus(id, status),
		onSuccess: (updatedUser) => {
			// 해당 사용자 캐시 업데이트
			queryClient.setQueryData(queryKeys.users.detail(updatedUser.id), updatedUser);

			// 사용자 목록과 통계 캐시 무효화
			queryClient.invalidateQueries({
				queryKey: queryKeys.users.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.users.stats(),
			});
		},
	});
};

// 대량 상태 변경 뮤테이션
export const useBulkUpdateUserStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userIds, status }: { userIds: string[]; status: 'active' | 'inactive' | 'deleted' }) =>
			userService.bulkUpdateStatus(userIds, status),
		onSuccess: () => {
			// 사용자 목록과 통계 캐시 무효화
			queryClient.invalidateQueries({
				queryKey: queryKeys.users.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.users.stats(),
			});
		},
	});
};

// 사용자 삭제 뮤테이션
export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => userService.deleteUser(id),
		onSuccess: (_, deletedId) => {
			// 해당 사용자 캐시 제거
			queryClient.removeQueries({
				queryKey: queryKeys.users.detail(deletedId),
			});

			// 사용자 목록과 통계 캐시 무효화
			queryClient.invalidateQueries({
				queryKey: queryKeys.users.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.users.stats(),
			});
		},
	});
};

// 기존 useUsers와 호환되는 훅 (점진적 마이그레이션용)
export const useUsers = (filters: UserFilters = {}) => {
	const usersQuery = useUsersQuery(filters);
	const statsQuery = useUserStats();
	const createUserMutation = useCreateUser();
	const updateUserMutation = useUpdateUser();
	const updateUserStatusMutation = useUpdateUserStatus();
	const bulkUpdateStatusMutation = useBulkUpdateUserStatus();
	const deleteUserMutation = useDeleteUser();

	// 통계 계산 (원본 데이터 기준)
	const stats = statsQuery.data || {
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
	};

	return {
		// 데이터
		users: usersQuery.data || [],
		loading: usersQuery.isLoading || statsQuery.isLoading,
		error: usersQuery.error?.message || statsQuery.error?.message || null,
		filters,
		stats,

		// 액션들
		loadUsers: () => {
			usersQuery.refetch();
			statsQuery.refetch();
		},
		createUser: createUserMutation.mutateAsync,
		updateUser: updateUserMutation.mutateAsync,
		updateUserStatus: updateUserStatusMutation.mutateAsync,
		bulkUpdateStatus: bulkUpdateStatusMutation.mutateAsync,
		deleteUser: deleteUserMutation.mutateAsync,
		getUserById: async (id: string) => {
			// 개별 사용자 조회는 서비스 직접 호출
			return await userService.getUserById(id);
		},
		updateFilters: () => {
			// 필터는 쿼리 키에 포함되어 자동으로 처리됨
		},
	};
};
