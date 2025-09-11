import { SupabaseClient } from '../client';

export abstract class BaseRepository<T> {
    constructor(protected supabase: SupabaseClient, protected tableName: string) {}

    async findAll(): Promise<T[]> {
        const { data, error } = await this.supabase.from(this.tableName).select('*');

        if (error) throw error;
        return data || [];
    }

    async findById(id: string): Promise<T | null> {
        const { data, error } = await this.supabase.from(this.tableName).select('*').eq('id', id).single();

        if (error) return null;
        return data;
    }

    async create(data: Partial<T>): Promise<T> {
        const { data: result, error } = await this.supabase.from(this.tableName).insert(data).select().single();

        if (error) throw error;
        return result;
    }

    async update(id: string, data: Partial<T>): Promise<T> {
        const { data: result, error } = await this.supabase.from(this.tableName).update(data).eq('id', id).select().single();

        if (error) throw error;
        return result;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase.from(this.tableName).delete().eq('id', id);

        if (error) throw error;
    }
}
