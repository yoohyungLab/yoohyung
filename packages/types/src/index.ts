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
	CategoryStats,
} from '@repo/supabase';

// 대시보드 관련 타입들
export interface DashboardStats {
	totalTests: number;
	publishedTests: number;
	todayResponses: number;
	weeklyResponses: number;
	todayVisitors: number;
	weeklyCompletionRate: number;
	responseGrowth: number;
	visitorGrowth: number;
}

export interface DashboardAlert {
	id: string;
	type: 'error' | 'warning' | 'success' | 'info';
	title: string;
	message: string;
	actionUrl?: string;
	actionText?: string;
	created_at: string;
}

export interface TestPerformance {
	id: string;
	title: string;
	emoji: string;
	todayResponses: number;
	conversionRate: number;
	trend: 'up' | 'down' | 'stable';
	responseGrowth: number;
}
