import { supabase } from '../client';

export const sectionApi = {
    async getAll() {
        const { data, error } = await supabase.from('sections').select('*').order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getById(id: string) {
        const { data, error } = await supabase.from('sections').select('*').eq('id', id).single();

        if (error) throw error;
        return data;
    },

    async create(section: any) {
        const { data, error } = await supabase.from('sections').insert(section).select().single();

        if (error) throw error;
        return data;
    },

    async update(id: string, section: any) {
        const { data, error } = await supabase.from('sections').update(section).eq('id', id).select().single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase.from('sections').delete().eq('id', id);

        if (error) throw error;
    },
};
