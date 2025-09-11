import { supabase } from '../client';

export interface Profile {
    id: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface ProfileFilters {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ProfileStats {
    total: number;
    active: number;
    inactive: number;
}

export interface ProfileWithActivity extends Profile {
    last_login?: string;
    test_count?: number;
}

export const profileApi = {
    async getAll(filters?: ProfileFilters) {
        let query = supabase.from('profiles').select('*');

        if (filters?.search) {
            query = query.ilike('email', `%${filters.search}%`);
        }

        if (filters?.sortBy) {
            query = query.order(filters.sortBy, {
                ascending: filters.sortOrder === 'asc',
            });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    },

    async getById(id: string) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();

        if (error) throw error;
        return data;
    },

    async getStats(): Promise<ProfileStats> {
        const { count: total, error: totalError } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;

        return {
            total: total || 0,
            active: total || 0, // Simplified for now
            inactive: 0,
        };
    },
};
