// Place domain/shared types here
export type Brand<T, U> = T & { __brand: U };

// Supabase에서 가져온 타입들 re-export
export type {
	Test,
	User,
	UserTestResponse,
	TestResult,
	Category,
	Feedback,
	TestType,
	TestStatus,
	FeedbackStatus,
	UserStatus,
	CategoryStatus,
} from '@pickid/supabase';

// 대시보드 관련 타입들


export interface DashboardAlert {
	id: string;
	type: 'error' | 'warning' | 'success' | 'info';
	title: string;
	message: string;
	actionUrl?: string;
	actionText?: string;
	created_at: string;
}


