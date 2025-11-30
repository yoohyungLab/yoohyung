import type { UserTestResponse } from '@pickid/supabase';

// TODO: 응답 타입 supabase에서 가져오기
export interface UserResponse extends UserTestResponse {
	test_title: string;
	test_slug: string;
	category_names: string[];
	result_name: string | null;
}

export interface ResponseFilters {
	test_id?: string;
	category_id?: string;
	device_type?: UserTestResponse['device_type'];
	date_from?: string;
	date_to?: string;
	search_query?: string;
	limit?: number;
	offset?: number;
}

export interface ResponseStats {
	total_responses: number;
	completed_responses: number;
	completion_rate: number;
	avg_completion_time: number;
	mobile_count: number;
	desktop_count: number;
	mobile_ratio: number;
	stats_generated_at: string;
}

export interface ResponseChartData {
	daily_responses: Array<{ date: string; count: number }>;
	device_breakdown: Array<{ device: string; count: number }>;
	result_breakdown: Array<{ result: string; count: number }>;
	period_days: number;
	generated_at: string;
}

export interface UserResponseDetail extends UserTestResponse {
	test: { id: string; title: string; slug: string; type: string };
	result: { id: string; name: string; description: string | null } | null;
	timing: { started_at: string | null; completed_at: string | null; duration_seconds: number | null };
	environment: {
		ip_address: string | null;
		user_agent: string | null;
		device_type: string | null;
		referrer: string | null;
	};
}

export interface ExportData {
	response_id: string;
	test_title: string;
	result_name: string;
	score: UserTestResponse['total_score'];
	completed_at: UserTestResponse['completed_at'];
	duration_seconds: UserTestResponse['completion_time_seconds'];
	device_type: UserTestResponse['device_type'];
	responses_json: string;
}
