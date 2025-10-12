import { supabase, createAdminClient } from '@pickid/supabase';
import type { ExtendedUser } from '@/shared/types/user.types';

// 간소화된 사용자 서비스
export const userService = {
	// 사용자 목록 조회
	async getUsers(): Promise<ExtendedUser[]> {
		const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });

		if (error) throw error;

		return (data || []).map((user) => ({
			...user,
			name: user.name || undefined,
			provider: (user.provider as 'email' | 'google' | 'kakao') || 'email',
			status: (user.status as 'active' | 'inactive' | 'deleted') || 'active',
			avatar_url: user.avatar_url || undefined,
		}));
	},

	// 사용자 상세 조회
	async getUserById(id: string): Promise<ExtendedUser> {
		const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

		if (error) throw error;
		if (!data) throw new Error('사용자를 찾을 수 없습니다.');

		return {
			...data,
			name: data.name || undefined,
			provider: (data.provider as 'email' | 'google' | 'kakao') || 'email',
			status: (data.status as 'active' | 'inactive' | 'deleted') || 'active',
			avatar_url: data.avatar_url || undefined,
		};
	},

	// 사용자 상태 변경
	async updateUserStatus(id: string, status: 'active' | 'inactive' | 'deleted'): Promise<ExtendedUser> {
		const { data, error } = await supabase
			.from('users')
			.update({ status, updated_at: new Date().toISOString() })
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;

		return {
			...data,
			name: data.name || undefined,
			provider: (data.provider as 'email' | 'google' | 'kakao') || 'email',
			status: (data.status as 'active' | 'inactive' | 'deleted') || 'active',
			avatar_url: data.avatar_url || undefined,
		};
	},

	// 사용자 삭제
	async deleteUser(id: string): Promise<void> {
		const { error } = await supabase.from('users').delete().eq('id', id);
		if (error) throw error;
	},

	// 사용자 통계 조회
	async getUserStats() {
		const { data, error } = await supabase.from('users').select('*');
		if (error) throw error;

		const users = data || [];
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
		const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		return {
			total: users.length,
			active: users.filter((u) => u.status === 'active').length,
			inactive: users.filter((u) => u.status === 'inactive').length,
			deleted: users.filter((u) => u.status === 'deleted').length,
			today: users.filter((u) => u.created_at && new Date(u.created_at) >= today).length,
			this_week: users.filter((u) => u.created_at && new Date(u.created_at) >= thisWeek).length,
			this_month: users.filter((u) => u.created_at && new Date(u.created_at) >= thisMonth).length,
			email_signups: users.filter((u) => u.provider === 'email').length,
			google_signups: users.filter((u) => u.provider === 'google').length,
			kakao_signups: users.filter((u) => u.provider === 'kakao').length,
		};
	},

	// 사용자 동기화 (Admin 전용)
	async syncAuthUsersToPublic() {
		const adminClient = createAdminClient();
		const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers();

		if (authError) throw authError;

		let synced = 0;
		const errors: string[] = [];

		for (const authUser of authUsers.users) {
			try {
				const { error } = await supabase.from('users').upsert({
					id: authUser.id,
					email: authUser.email,
					name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Unknown',
					provider: authUser.app_metadata?.provider || 'email',
					status:
						(authUser as any).banned_until && new Date((authUser as any).banned_until) > new Date()
							? 'inactive'
							: 'active',
					avatar_url: authUser.user_metadata?.avatar_url || null,
					created_at: authUser.created_at,
					updated_at: new Date().toISOString(),
				});

				if (error) {
					errors.push(`${authUser.email}: ${error.message}`);
				} else {
					synced++;
				}
			} catch (error) {
				errors.push(`${authUser.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}

		return { synced, errors };
	},
};
