import { supabase } from '@repo/shared';
import type {
	User,
	UserFilters,
	UserWithActivity,
	UserActivityStats,
	UserActivityItem,
	Feedback,
} from '@repo/supabase';
import type { UserStats } from '../types';

export const userService = {
	async getUsers(
		filters: UserFilters = {},
		page: number = 1,
		pageSize: number = 20
	): Promise<{
		users: User[];
		total: number;
		totalPages: number;
		currentPage: number;
	}> {
		// Count
		let countQuery = supabase.from('users').select('*', { count: 'exact', head: true });
		if (filters.status && filters.status !== 'all') countQuery = countQuery.eq('status', filters.status);
		if (filters.provider && filters.provider !== 'all') countQuery = countQuery.eq('provider', filters.provider);
		if (filters.search) countQuery = countQuery.or(`email.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
		const { count, error: countError } = await countQuery;
		if (countError) throw countError;

		// Data
		let dataQuery = supabase.from('users').select('*').order('created_at', { ascending: false });
		if (filters.status && filters.status !== 'all') dataQuery = dataQuery.eq('status', filters.status);
		if (filters.provider && filters.provider !== 'all') dataQuery = dataQuery.eq('provider', filters.provider);
		if (filters.search) dataQuery = dataQuery.or(`email.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;
		dataQuery = dataQuery.range(from, to);
		const { data, error: dataError } = await dataQuery;
		if (dataError) throw dataError;

		return {
			users: (data as User[]) || [],
			total: count || 0,
			totalPages: Math.ceil((count || 0) / pageSize),
			currentPage: page,
		};
	},

	async getUserStats(): Promise<UserStats> {
		const { data, error } = await supabase.from('users').select('status, provider, created_at');
		if (error) throw error;

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

	async getUserDetails(userId: string): Promise<UserWithActivity> {
		const { data: user, error: userError } = await supabase.from('users').select('*').eq('id', userId).single();
		if (userError) throw userError;

		let activityStats;
		try {
			activityStats = await this.getUserActivityStats(userId);
		} catch {
			activityStats = this.getDefaultActivityStats();
		}

		return { ...(user as User), activity: activityStats };
	},

	async updateUserStatus(userId: string, status: string): Promise<User> {
		const { data, error } = await supabase
			.from('users')
			.update({
				status,
				updated_at: new Date().toISOString(),
			})
			.eq('id', userId)
			.select()
			.single();
		if (error) throw error;
		return data as User;
	},

	async bulkUpdateStatus(userIds: string[], status: string): Promise<number> {
		const { data, error } = await supabase
			.from('users')
			.update({
				status,
				updated_at: new Date().toISOString(),
			})
			.in('id', userIds)
			.select();
		if (error) throw error;
		return (data as User[])?.length || 0;
	},

	async deleteUser(userId: string): Promise<void> {
		await this.updateUserStatus(userId, 'deleted');
	},

	async getUserActivityStats(userId: string): Promise<UserActivityStats> {
		const { data: responses, error: responsesError } = await supabase
			.from('user_test_responses')
			.select('id, test_id, started_at, completed_at')
			.eq('user_id', userId);

		if (responsesError) {
			console.warn('사용자 활동 통계 조회 실패:', responsesError);
			return this.getDefaultActivityStats();
		}

		if (!responses || responses.length === 0) {
			return this.getDefaultActivityStats();
		}

		const totalResponses = responses.length;
		const uniqueTests = new Set(responses.map((r: UserActivityItem) => r.test_id).filter(Boolean)).size;
		const completedResponses = responses.filter((r: UserActivityItem) => r.completed_at);
		const avgCompletionRate = totalResponses > 0 ? completedResponses.length / totalResponses : 0;
		const avgDuration = 0;
		const activityScore = Math.round(totalResponses * 10 + uniqueTests * 20 + avgCompletionRate * 100);

		return {
			total_responses: totalResponses,
			unique_tests: uniqueTests,
			avg_completion_rate: avgCompletionRate,
			avg_duration_sec: avgDuration,
			top_result_type: null,
			activity_score: activityScore,
		};
	},

	async getUserActivity(userId: string): Promise<UserActivityItem[]> {
		const { data: responses, error: responsesError } = await supabase
			.from('user_test_responses')
			.select('id, test_id, started_at, completed_at, created_at, score, result_id')
			.eq('user_id', userId)
			.order('started_at', { ascending: false })
			.limit(5);

		if (responsesError) {
			console.warn('사용자 활동 조회 실패:', responsesError);
			return [];
		}

		if (!responses || responses.length === 0) {
			return [];
		}

		const testIds = responses.map((r: UserActivityItem) => r.test_id).filter(Boolean) as string[];
		let testDetails: Array<{
			id: string;
			title: string;
			category_id: number | null;
		}> = [];
		if (testIds.length > 0) {
			const { data: tests } = await supabase.from('tests').select('id, title, category_id').in('id', testIds);
			if (tests) testDetails = tests;
		}

		return (responses as UserActivityItem[]).map((item) => {
			const testInfo = testDetails.find((t) => t.id === item.test_id);
			const isCompleted = !!item.completed_at;
			return {
				id: item.id,
				test_id: item.test_id,
				test_title: testInfo?.title || '알 수 없는 테스트',
				test_category: testInfo?.category_id || '기타',
				test_emoji: this.getCategoryEmoji((testInfo?.category_id as unknown as string) || null),
				started_at: item.started_at,
				completed_at: item.completed_at,
				status: isCompleted ? 'completed' : 'in_progress',
				duration_sec: 0,
				result_type: '결과 없음',
			} as UserActivityItem;
		});
	},

	async getUserFeedbacks(userId: string): Promise<Feedback[]> {
		// 먼저 사용자 정보를 가져와서 이메일을 확인
		const { data: user, error: userError } = await supabase.from('users').select('email').eq('id', userId).single();

		if (userError || !user?.email) {
			console.warn('사용자 이메일을 찾을 수 없습니다:', userError);
			return [];
		}

		// 이메일로 피드백 조회
		const { data, error } = await supabase
			.from('feedbacks')
			.select('*')
			.eq('author_email', user.email)
			.order('created_at', { ascending: false })
			.limit(5);

		if (error) {
			console.warn('피드백 조회 실패:', error);
			return [];
		}
		return (data as Feedback[]) || [];
	},

	getDefaultActivityStats(): UserActivityStats {
		return {
			total_responses: 0,
			unique_tests: 0,
			avg_completion_rate: 0,
			avg_duration_sec: 0,
			top_result_type: null,
			activity_score: 0,
		};
	},

	getCategoryEmoji(categoryId: string | null): string {
		if (!categoryId) return '📝';
		const emojiMap: { [key: string]: string } = {
			'1': '🧠',
			'2': '💼',
			'3': '💕',
			'4': '🎨',
			'5': '🏥',
			'6': '📚',
			'7': '💰',
			'8': '🌟',
			default: '📝',
		};
		return emojiMap[categoryId] || emojiMap.default;
	},
};
