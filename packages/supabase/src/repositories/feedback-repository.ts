import { BaseRepository } from './base-repository';
import { supabase } from '../client';

export interface Feedback {
    id: string;
    user_id: string;
    test_id: string;
    content: string;
    rating: number;
    created_at: string;
    updated_at: string;
}

export class FeedbackRepository extends BaseRepository<Feedback> {
    constructor() {
        super(supabase, 'feedbacks');
    }

    async findByTestId(testId: string): Promise<Feedback[]> {
        const { data, error } = await this.supabase.from('feedbacks').select('*').eq('test_id', testId);

        if (error) throw error;
        return data || [];
    }

    async findByUserId(userId: string): Promise<Feedback[]> {
        const { data, error } = await this.supabase.from('feedbacks').select('*').eq('user_id', userId);

        if (error) throw error;
        return data || [];
    }
}
