import { supabase } from '@repo/shared';
import type {
    Profile,
    ProfileFilters,
    ProfileStats,
    ProfileWithActivity,
    Feedback,
    ProfileActivityStats,
    ProfileActivityItem,
    PartialTestForActivity,
} from '@repo/supabase';

export const profileService = {
    async getProfiles(
        filters: ProfileFilters = {},
        page: number = 1,
        pageSize: number = 20
    ): Promise<{
        profiles: Profile[];
        total: number;
        totalPages: number;
        currentPage: number;
    }> {
        // Count
        let countQuery = supabase.from('profiles').select('*', { count: 'exact', head: true });
        if (filters.status && filters.status !== 'all') countQuery = countQuery.eq('status', filters.status);
        if (filters.provider && filters.provider !== 'all') countQuery = countQuery.eq('provider', filters.provider);
        if (filters.search) countQuery = countQuery.or(`email.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
        const { count, error: countError } = await countQuery;
        if (countError) throw countError;

        // Data
        let dataQuery = supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (filters.status && filters.status !== 'all') dataQuery = dataQuery.eq('status', filters.status);
        if (filters.provider && filters.provider !== 'all') dataQuery = dataQuery.eq('provider', filters.provider);
        if (filters.search) dataQuery = dataQuery.or(`email.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        dataQuery = dataQuery.range(from, to);
        const { data, error: dataError } = await dataQuery;
        if (dataError) throw dataError;

        return {
            profiles: (data as Profile[]) || [],
            total: count || 0,
            totalPages: Math.ceil((count || 0) / pageSize),
            currentPage: page,
        };
    },

    async getProfileStats(): Promise<ProfileStats> {
        const { data, error } = await supabase.from('profiles').select('status, provider, created_at');
        if (error) throw error;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return {
            total: data?.length || 0,
            active: data?.filter((p: Profile) => p.status === 'active').length || 0,
            inactive: data?.filter((p: Profile) => p.status === 'inactive').length || 0,
            deleted: data?.filter((p: Profile) => p.status === 'deleted').length || 0,
            today: data?.filter((p: Profile) => new Date(p.created_at || '') >= today).length || 0,
            this_week: data?.filter((p: Profile) => new Date(p.created_at || '') >= thisWeek).length || 0,
            this_month: data?.filter((p: Profile) => new Date(p.created_at || '') >= thisMonth).length || 0,
            email_signups: data?.filter((p: Profile) => p.provider === 'email').length || 0,
            google_signups: data?.filter((p: Profile) => p.provider === 'google').length || 0,
            kakao_signups: data?.filter((p: Profile) => p.provider === 'kakao').length || 0,
        };
    },

    async getProfileDetails(profileId: string): Promise<ProfileWithActivity> {
        const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', profileId).single();
        if (profileError) throw profileError;

        let activityStats;
        try {
            activityStats = await this.getProfileActivityStats(profileId);
        } catch {
            activityStats = this.getDefaultActivityStats();
        }

        return { ...(profile as Profile), activity: activityStats };
    },

    async updateProfileStatus(profileId: string, status: string): Promise<Profile> {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq('id', profileId)
            .select()
            .single();
        if (error) throw error;
        return data as Profile;
    },

    async bulkUpdateStatus(profileIds: string[], status: string): Promise<number> {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .in('id', profileIds)
            .select();
        if (error) throw error;
        return (data as Profile[])?.length || 0;
    },

    async deleteProfile(profileId: string): Promise<void> {
        await this.updateProfileStatus(profileId, 'deleted');
    },

    async exportProfiles(filters: ProfileFilters = {}): Promise<Profile[]> {
        const { profiles } = await this.getProfiles(filters, 1, 10000);
        return profiles;
    },

    async getProfileActivityStats(profileId: string): Promise<ProfileActivityStats> {
        const { data: responses, error: responsesError } = await supabase
            .from('test_responses')
            .select('id, test_id, started_at, completed_at')
            .eq('user_id', profileId);

        if (responsesError || !responses || responses.length === 0) {
            return this.getDefaultActivityStats();
        }

        const totalResponses = responses.length;
        const uniqueTests = new Set(responses.map((r: ProfileActivityItem) => r.test_id).filter(Boolean)).size;
        const completedResponses = responses.filter((r: ProfileActivityItem) => r.completed_at);
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

    async getProfileActivity(profileId: string): Promise<ProfileActivityItem[]> {
        const { data: responses, error: responsesError } = await supabase
            .from('test_responses')
            .select('id, test_id, started_at, completed_at')
            .eq('user_id', profileId)
            .order('started_at', { ascending: false })
            .limit(5);

        if (responsesError || !responses || responses.length === 0) {
            return [];
        }

        const testIds = responses.map((r: ProfileActivityItem) => r.test_id).filter(Boolean) as string[];
        let testDetails: PartialTestForActivity[] = [];
        if (testIds.length > 0) {
            const { data: tests } = await supabase.from('tests').select('id, title, category_id').in('id', testIds);
            if (tests) testDetails = tests as PartialTestForActivity[];
        }

        return (responses as ProfileActivityItem[]).map((item) => {
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
            } as ProfileActivityItem;
        });
    },

    async getProfileFeedbacks(profileId: string): Promise<Feedback[]> {
        const { data, error } = await supabase
            .from('feedbacks')
            .select('*')
            .eq('user_id', profileId)
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) return [];
        return (data as Feedback[]) || [];
    },

    getDefaultActivityStats(): ProfileActivityStats {
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
