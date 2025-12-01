import type { User, UserResponseStats, UserStatus } from '@pickid/supabase';

export interface ExtendedUser extends Omit<User, 'avatar_url'> {
	name?: string;
	provider: string;
	status: UserStatus | null;
	avatar_url?: string | null;
}

export interface AdminUserResponseStats extends UserResponseStats {
	mobile_ratio: number;
}
