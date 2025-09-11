import { BaseRepository } from './base-repository';
import { supabase } from '../client';

export interface User {
    id: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(supabase, 'users');
    }

    async findByEmail(email: string): Promise<User | null> {
        const { data, error } = await this.supabase.from('users').select('*').eq('email', email).single();

        if (error) return null;
        return data;
    }
}
