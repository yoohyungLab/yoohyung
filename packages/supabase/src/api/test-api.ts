import { supabase } from '../client';

export const testApi = {
    async getAll() {
        const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getById(id: string) {
        const { data, error } = await supabase.from('tests').select('*').eq('id', id).single();

        if (error) throw error;
        return data;
    },

    async create(test: any) {
        const { data, error } = await supabase.from('tests').insert(test).select().single();

        if (error) throw error;
        return data;
    },

    async update(id: string, test: any) {
        const { data, error } = await supabase.from('tests').update(test).eq('id', id).select().single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase.from('tests').delete().eq('id', id);

        if (error) throw error;
    },
};
