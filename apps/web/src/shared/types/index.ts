// =========================
// [EGEN-TETO 테스트 타입]
// =========================
export type TestResult = 'egen-male' | 'egen-female' | 'teto-male' | 'teto-female' | 'mixed';
export type Gender = 'male' | 'female';

// =========================
// [다른 테스트 타입은 아래에 추가]
// =========================

// =========================
// [공통 타입들]
// =========================

// Supabase에서 가져온 타입들 re-export
export type { Test, User, Feedback } from '@repo/supabase';

// 결과 관련 타입
export interface TestResultData {
	title: string;
	description: string;
	characteristics: string[];
	emoji: string;
}

// API 응답 타입
export interface ApiResponse<T = unknown> {
	data: T;
	message?: string;
	success: boolean;
}

// 페이지네이션 타입
export interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

// 분석 이벤트 타입
export interface AnalyticsEvent {
	event: string;
	properties?: Record<string, unknown>;
	userId?: string;
	sessionId?: string;
}
