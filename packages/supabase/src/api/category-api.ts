import { supabase } from '../client';

export const categoryApi = {
    async getAll() {
        const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getById(id: string) {
        const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();

        if (error) throw error;
        return data;
    },

    async create(category: any) {
        const { data, error } = await supabase.from('categories').insert(category).select().single();

        if (error) throw error;
        return data;
    },

    async update(id: string, category: any) {
        const { data, error } = await supabase.from('categories').update(category).eq('id', id).select().single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase.from('categories').delete().eq('id', id);

        if (error) throw error;
    },
};
