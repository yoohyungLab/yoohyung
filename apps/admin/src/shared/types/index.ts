// 타입 정의들 re-export
export * from './feedback';

// 피드백 관련 타입들
export interface FeedbackStats {
	total: number;
	pending: number;
	replied: number;
	archived: number;
}

export interface AdminFeedbackResponse {
	id: string;
	user_id: string;
	user_name: string;
	user_email: string;
	title: string;
	content: string;
	status: string;
	priority: string;
	created_at: string;
	updated_at: string;
	replied_at?: string;
	admin_reply?: string;
}
