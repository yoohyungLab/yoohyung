import { useState, useCallback, useEffect, useMemo } from 'react';
import { userService } from '@/shared/api';
import type { User, UserFilters } from '@repo/supabase';

export const useUsers = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<UserFilters>({
		search: '',
		status: 'all',
		provider: 'all',
	});

	// 통계 계산 (원본 데이터 기준)
	const stats = useMemo(() => {
		if (users.length === 0) {
			return {
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
		}

		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
		const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		return {
			total: users.length,
			active: users.filter((u) => u.status === 'active').length,
			inactive: users.filter((u) => u.status === 'inactive').length,
			deleted: users.filter((u) => u.status === 'deleted').length,
			today: users.filter((u) => new Date(u.created_at || '') >= today).length,
			this_week: users.filter((u) => new Date(u.created_at || '') >= thisWeek).length,
			this_month: users.filter((u) => new Date(u.created_at || '') >= thisMonth).length,
			email_signups: users.filter((u) => u.provider === 'email').length,
			google_signups: users.filter((u) => u.provider === 'google').length,
			kakao_signups: users.filter((u) => u.provider === 'kakao').length,
		};
	}, [users]);

	// 필터링된 사용자
	const filteredUsers = useMemo(() => {
		return users.filter((user) => {
			const matchesSearch =
				!filters.search ||
				user.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
				user.name?.toLowerCase().includes(filters.search.toLowerCase());
			const matchesStatus = filters.status === 'all' || user.status === filters.status;
			const matchesProvider = filters.provider === 'all' || user.provider === filters.provider;
			return matchesSearch && matchesStatus && matchesProvider;
		});
	}, [users, filters]);

	// 데이터 로딩
	const loadUsers = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await userService.getUsers();
			setUsers(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : '사용자를 불러오는데 실패했습니다.');
		} finally {
			setLoading(false);
		}
	}, []);

	// 사용자 생성
	const createUser = useCallback(
		async (userData: { email: string; name?: string; avatar_url?: string; provider?: string; status?: string }) => {
			try {
				const newUser = await userService.createUser(userData);
				setUsers((prev) => [newUser, ...prev]); // 맨 앞에 추가
				return newUser;
			} catch (err) {
				setError(err instanceof Error ? err.message : '사용자 생성에 실패했습니다.');
				throw err;
			}
		},
		[]
	);

	// 사용자 수정
	const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
		try {
			const updatedUser = await userService.updateUser(id, updates);
			setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
			return updatedUser;
		} catch (err) {
			setError(err instanceof Error ? err.message : '사용자 수정에 실패했습니다.');
			throw err;
		}
	}, []);

	// 사용자 상태 변경
	const updateUserStatus = useCallback(async (id: string, status: 'active' | 'inactive' | 'deleted') => {
		try {
			const updatedUser = await userService.updateUserStatus(id, status);
			setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
		} catch (err) {
			setError(err instanceof Error ? err.message : '사용자 상태 변경에 실패했습니다.');
		}
	}, []);

	// 대량 상태 변경
	const bulkUpdateStatus = useCallback(
		async (userIds: string[], status: 'active' | 'inactive' | 'deleted') => {
			try {
				await userService.bulkUpdateStatus(userIds, status);
				// 상태 업데이트 후 전체 데이터 다시 로드
				await loadUsers();
			} catch (err) {
				setError(err instanceof Error ? err.message : '사용자 일괄 상태 변경에 실패했습니다.');
			}
		},
		[loadUsers]
	);

	// 사용자 삭제
	const deleteUser = useCallback(async (id: string) => {
		try {
			await userService.deleteUser(id);
			setUsers((prev) => prev.filter((u) => u.id !== id));
		} catch (err) {
			setError(err instanceof Error ? err.message : '사용자 삭제에 실패했습니다.');
		}
	}, []);

	// 사용자 상세 조회
	const getUserById = useCallback(async (id: string) => {
		try {
			return await userService.getUserById(id);
		} catch (err) {
			setError(err instanceof Error ? err.message : '사용자 상세 정보를 불러오는데 실패했습니다.');
			throw err;
		}
	}, []);

	// 필터 업데이트
	const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	// 초기 로딩
	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	return {
		users: filteredUsers,
		loading,
		error,
		filters,
		stats,
		loadUsers,
		createUser,
		updateUser,
		updateUserStatus,
		bulkUpdateStatus,
		deleteUser,
		getUserById,
		updateFilters,
	};
};
