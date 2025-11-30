import type { User, UserResponseStats, UserStatus } from '@pickid/supabase';

export interface ExtendedUser extends User {
	name?: string;
	provider: string;
	status: UserStatus | null;
	avatar_url?: string;
}

export interface AdminUserResponseStats extends UserResponseStats {
	mobile_ratio: number;
}
