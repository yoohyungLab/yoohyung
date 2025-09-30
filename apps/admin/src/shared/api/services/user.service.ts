import { supabase } from '@repo/shared';
import type { User } from '@repo/supabase';

export const userService = {
	// 사용자 목록 조회
	async getUsers(): Promise<User[]> {
		const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });

		if (error) throw error;
		return data || [];
	},

	// 사용자 상세 조회
	async getUserById(id: string): Promise<User> {
		const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
		if (error) throw error;
		return data;
	},

	// 사용자 생성
	async createUser(user: {
		email: string;
		name?: string;
		avatar_url?: string;
		provider?: string;
		status?: string;
	}): Promise<User> {
		const userData = {
			...user,
			status: user.status || 'active',
		};
		const { data, error } = await supabase.from('users').insert(userData).select().single();
		if (error) throw error;
		return data;
	},

	// 사용자 수정
	async updateUser(id: string, updates: Partial<User>): Promise<User> {
		const { data, error } = await supabase
			.from('users')
			.update({ ...updates, updated_at: new Date().toISOString() })
			.eq('id', id)
			.select()
			.single();
		if (error) throw error;
		return data;
	},

	// 상태 변경
	async updateUserStatus(id: string, status: 'active' | 'inactive' | 'deleted'): Promise<User> {
		return this.updateUser(id, { status });
	},

	// 대량 상태 변경
	async bulkUpdateStatus(userIds: string[], status: 'active' | 'inactive' | 'deleted'): Promise<number> {
		const { data, error } = await supabase
			.from('users')
			.update({ status, updated_at: new Date().toISOString() })
			.in('id', userIds)
			.select();
		if (error) throw error;
		return data?.length || 0;
	},

	// 사용자 삭제 (소프트 삭제)
	async deleteUser(id: string): Promise<void> {
		await this.updateUserStatus(id, 'deleted');
	},

	// 사용자 통계 조회
	async getUserStats(): Promise<{
		total: number;
		active: number;
		inactive: number;
		deleted: number;
		today: number;
		this_week: number;
		this_month: number;
		email_signups: number;
		google_signups: number;
		kakao_signups: number;
	}> {
		const { data, error } = await supabase.from('users').select('status, provider, created_at');
		if (error) {
			console.error('getUserStats error:', error);
			throw error;
		}

		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
		const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		return {
			total: data?.length || 0,
			active: data?.filter((u: User) => u.status === 'active').length || 0,
			inactive: data?.filter((u: User) => u.status === 'inactive').length || 0,
			deleted: data?.filter((u: User) => u.status === 'deleted').length || 0,
			today: data?.filter((u: User) => new Date(u.created_at || '') >= today).length || 0,
			this_week: data?.filter((u: User) => new Date(u.created_at || '') >= thisWeek).length || 0,
			this_month: data?.filter((u: User) => new Date(u.created_at || '') >= thisMonth).length || 0,
			email_signups: data?.filter((u: User) => u.provider === 'email').length || 0,
			google_signups: data?.filter((u: User) => u.provider === 'google').length || 0,
			kakao_signups: data?.filter((u: User) => u.provider === 'kakao').length || 0,
		};
	},

	// 사용자 활동 조회
	async getUserActivity(userId: string) {
		const { data, error } = await supabase
			.from('user_test_responses')
			.select(
				`
				id,
				test_id,
				started_at,
				completed_at,
				duration_sec,
				result_type,
				status,
				tests!inner(
					id,
					title,
					emoji
				)
			`
			)
			.eq('user_id', userId)
			.order('started_at', { ascending: false });

		if (error) throw error;

		return (data || []).map(
			(item: {
				id: string;
				test_id: string;
				started_at: string;
				completed_at: string | null;
				duration_sec: number | null;
				result_type: string | null;
				status: string | null;
				tests: {
					id: string;
					title: string;
					emoji: string | null;
				} | null;
			}) => ({
				id: item.id,
				test_id: item.test_id,
				test_title: item.tests?.title || 'Unknown Test',
				test_emoji: item.tests?.emoji || '📝',
				started_at: item.started_at,
				completed_at: item.completed_at,
				duration_sec: item.duration_sec,
				result_type: item.result_type,
				status: item.status || 'pending',
			})
		);
	},

	// 사용자 피드백 조회
	async getUserFeedbacks(userId: string) {
		const { data, error } = await supabase
			.from('feedbacks')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data || [];
	},
};
