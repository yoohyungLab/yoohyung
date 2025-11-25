import type { User } from '@pickid/supabase';

export interface ExtendedUser extends User {
	name?: string;
	provider: 'email' | 'google' | 'kakao';
	status: 'active' | 'inactive' | 'deleted';
	avatar_url?: string;
}

