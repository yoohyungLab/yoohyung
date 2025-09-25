// Place domain/shared types here
export type Brand<T, U> = T & { __brand: U };

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

// 데이터베이스 테이블 타입들
export interface Test {
	id: string;
	title: string;
	description: string;
	slug: string;
	thumbnail_url?: string;
	response_count: number;
	view_count: number;
	category_ids: string[];
	short_code?: string;
	intro_text?: string;
	status: 'draft' | 'published';
	estimated_time?: number;
	scheduled_at?: string;
	max_score?: number;
	type: 'psychology' | 'quiz';
	published_at?: string;
	created_at: string;
	updated_at: string;
}

export interface User {
	id: string;
	email?: string;
	name?: string;
	avatar_url?: string;
	provider?: string;
	created_at: string;
	updated_at: string;
	status?: string;
}

export interface UserTestResponse {
	id: string;
	test_id: string;
	user_id?: string;
	session_id: string;
	result_id?: string;
	total_score?: number;
	started_at?: string;
	completed_at?: string;
	completion_time_seconds?: number;
	ip_address?: string;
	user_agent?: string;
	referrer?: string;
	device_type?: string;
	responses: Record<string, any>;
	created_date?: string;
	created_at: string;
}

export interface TestResult {
	id: string;
	test_id: string;
	result_name: string;
	result_order: number;
	description?: string;
	match_conditions: Record<string, any>;
	background_image_url?: string;
	theme_color?: string;
	features: Record<string, any>;
	created_at: string;
	updated_at: string;
}

export interface Category {
	id: string;
	name: string;
	slug: string;
	description?: string;
	sort_order?: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	icon_url?: string;
	banner_url?: string;
	thumbnail_url?: string;
}

export interface Feedback {
	id: string;
	title: string;
	content: string;
	category: string;
	status: string;
	author_name?: string;
	author_email?: string;
	attached_file_url?: string;
	admin_reply?: string;
	admin_reply_at?: string;
	views: number;
	created_at: string;
	updated_at: string;
}
