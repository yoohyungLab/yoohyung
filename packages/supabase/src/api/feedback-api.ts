import { supabase } from '../client';

export const feedbackApi = {
    async getAll() {
        const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getById(id: string) {
        const { data, error } = await supabase.from('feedbacks').select('*').eq('id', id).single();

        if (error) throw error;
        return data;
    },

    async create(feedback: any) {
        const { data, error } = await supabase.from('feedbacks').insert(feedback).select().single();

        if (error) throw error;
        return data;
    },

    async update(id: string, feedback: any) {
        const { data, error } = await supabase.from('feedbacks').update(feedback).eq('id', id).select().single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase.from('feedbacks').delete().eq('id', id);

        if (error) throw error;
    },
};
