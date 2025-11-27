// Auth Types
//
// 인증 관련 타입을 정의합니다.

import type { User } from '@supabase/supabase-js';

// 인증 상태
export interface AuthState {
	user: User | null;
	loading: boolean;
	isAuthenticated?: boolean;
}
