import { useState, useCallback, useEffect } from 'react';
import { userService } from '@/shared/api';
import type { User, UserFilters } from '@repo/supabase';
import type { UserStats } from '@/shared/api/types';

export const useUsers = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalUsers, setTotalUsers] = useState(0);
	const [stats, setStats] = useState<UserStats>({
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
	});

	// 자동으로 모든 사용자 로드
	useEffect(() => {
		const loadInitialData = async () => {
			try {
				setLoading(true);
				setError(null);

				const [userResult, statsResult] = await Promise.all([
					userService.getUsers({}, 1, 20),
					userService.getUserStats(),
				]);

				setUsers(userResult.users);
				setTotalUsers(userResult.total);
				setStats(statsResult);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '사용자를 불러오는데 실패했습니다.';
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		loadInitialData();
	}, []);

	const fetchUsers = useCallback(async (filters?: UserFilters, page = 1, pageSize = 20) => {
		try {
			setLoading(true);
			setError(null);

			const [userResult, statsResult] = await Promise.all([
				userService.getUsers(filters, page, pageSize),
				userService.getUserStats(),
			]);

			setUsers(userResult.users);
			setTotalUsers(userResult.total);
			setStats(statsResult);

			return userResult;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '사용자를 불러오는데 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateUserStatus = useCallback(
		async (id: string, status: 'active' | 'inactive' | 'deleted') => {
			try {
				setLoading(true);
				setError(null);

				const updatedUser = await userService.updateUserStatus(id, status);

				// 상태 변경 후 즉시 UI 업데이트
				setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));

				// 통계도 즉시 업데이트
				const oldStatus = users.find((u) => u.id === id)?.status || 'active';
				if (oldStatus && status) {
					setStats((prev) => ({
						...prev,
						[status]: (prev[status as keyof typeof prev] || 0) + 1,
						[oldStatus]: Math.max((prev[oldStatus as keyof typeof prev] || 0) - 1, 0),
					}));
				}

				return updatedUser;
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '사용자 상태 수정에 실패했습니다.';
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[users]
	);

	const bulkUpdateStatus = useCallback(
		async (ids: string[], status: 'active' | 'inactive' | 'deleted') => {
			try {
				setLoading(true);
				setError(null);

				await userService.bulkUpdateStatus(ids, status);

				// 상태 변경 후 전체 데이터 다시 로드
				await fetchUsers();

				return ids.length;
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '사용자 일괄 수정에 실패했습니다.';
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[fetchUsers]
	);

	const deleteUser = useCallback(
		async (id: string) => {
			try {
				setLoading(true);
				setError(null);

				await userService.deleteUser(id);

				// 삭제 후 전체 데이터 다시 로드
				await fetchUsers();
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '사용자 삭제에 실패했습니다.';
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[fetchUsers]
	);

	const getUserDetails = useCallback(async (id: string) => {
		try {
			setLoading(true);
			setError(null);
			return await userService.getUserDetails(id);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '사용자 상세 정보를 불러오는데 실패했습니다.';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	return {
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
	};
};
