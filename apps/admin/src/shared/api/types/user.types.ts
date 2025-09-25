// User 관련 타입들을 supabase에서 가져옴
export type {
	User,
	UserInsert,
	UserUpdate,
	UserWithActivity,
	UserActivityItem,
	UserActivityStats,
	UserFilters,
	UserStatus,
	Feedback,
} from '@repo/supabase';

// UserStats는 admin에서만 사용하므로 여기서 정의
export interface UserStats {
	total: number;
	active: number;
	inactive: number;
	deleted: number;
	today: number;
	this_week: number;
	this_month: number;
	email_signups: number;
	google_signups: number;
	kakao_signups: number;
}
