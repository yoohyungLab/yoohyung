import { supabase } from '@repo/shared';
import type { Feedback, FeedbackFilters } from '@repo/supabase';

export interface AdminFeedbackResponse {
    feedbacks: Feedback[];
    total: number;
    totalPages: number;
    currentPage: number;
}

export const feedbackService = {
    async getFeedbacks(filters: FeedbackFilters = {}, page: number = 1, pageSize: number = 20): Promise<AdminFeedbackResponse> {
        let query = supabase.from('feedbacks').select('*', { count: 'exact' });

        // 필터 적용
        if (filters.status && filters.status !== 'all') {
            query = query.eq('status', filters.status);
        }
        if (filters.category && filters.category !== 'all') {
            query = query.eq('category', filters.category);
        }
        if (filters.search) {
            query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%,author_name.ilike.%${filters.search}%`);
        }

        // 페이징 및 정렬
        const { data, count, error } = await query
            .order('created_at', { ascending: false })
            .range((page - 1) * pageSize, page * pageSize - 1);

        if (error) throw error;

        return {
            feedbacks: data || [],
            total: count || 0,
            totalPages: Math.ceil((count || 0) / pageSize),
            currentPage: page,
        };
    },

    async getMyFeedbacks(userId: string) {
        try {
            const { data, error } = await supabase
                .from('feedbacks')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data: data || [], error: null };
        } catch (error) {
            return { data: [], error };
        }
    },

    async getAllFeedbacks() {
        const { data, error } = await supabase.from('feedbacks').select('*', { count: 'exact' }).order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async createFeedback(feedbackData: {
        title: string;
        content: string;
        category: string;
        user_id: string;
        author_name: string;
        author_email: string;
        attached_file_url?: string | null;
    }) {
        try {
            const { data, error } = await supabase
                .from('feedbacks')
                .insert([
                    {
                        ...feedbackData,
                        status: 'pending',
                        views: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                ])
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async getFeedbackById(id: string) {
        const { data, error } = await supabase.from('feedbacks').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async updateFeedbackStatus(id: string, status: string) {
        const { data, error } = await supabase
            .from('feedbacks')
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async addAdminReply(id: string, reply: string) {
        const { data, error } = await supabase
            .from('feedbacks')
            .update({
                admin_reply: reply,
                admin_reply_at: new Date().toISOString(),
                status: 'replied',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteFeedback(id: string) {
        const { error } = await supabase.from('feedbacks').delete().eq('id', id);
        if (error) throw error;
    },

    async bulkUpdateStatus(feedbackIds: string[], status: string): Promise<number> {
        const { data, error } = await supabase
            .from('feedbacks')
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .in('id', feedbackIds)
            .select();

        if (error) throw error;
        return data?.length || 0;
    },

    async getFeedbackStats() {
        const { data, error } = await supabase.from('feedbacks').select('status, created_at');
        if (error) throw error;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const stats = {
            total: data?.length || 0,
            pending: data?.filter((f: Feedback) => f.status === 'pending').length || 0,
            in_progress: data?.filter((f: Feedback) => f.status === 'in_progress').length || 0,
            completed: data?.filter((f: Feedback) => f.status === 'completed').length || 0,
            replied: data?.filter((f: Feedback) => f.status === 'replied').length || 0,
            rejected: data?.filter((f: Feedback) => f.status === 'rejected').length || 0,
            today: data?.filter((f: Feedback) => new Date(f.created_at) >= today).length || 0,
            thisWeek: data?.filter((f: Feedback) => new Date(f.created_at) >= thisWeek).length || 0,
            thisMonth: data?.filter((f: Feedback) => new Date(f.created_at) >= thisMonth).length || 0,
        };

        return stats;
    },
};
