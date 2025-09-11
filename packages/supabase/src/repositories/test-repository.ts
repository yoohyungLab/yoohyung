import { BaseRepository } from './base-repository';
import { supabase } from '../client';

export interface Test {
    id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export class TestRepository extends BaseRepository<Test> {
    constructor() {
        super(supabase, 'tests');
    }

    async findByTitle(title: string): Promise<Test[]> {
        const { data, error } = await this.supabase.from('tests').select('*').ilike('title', `%${title}%`);

        if (error) throw error;
        return data || [];
    }
}
