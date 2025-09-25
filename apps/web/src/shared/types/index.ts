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

// 테스트 관련 타입
export interface Test {
	id: string;
	title: string;
	description: string;
	image: string;
	color: string;
	category: number;
	tags: string[];
}

// 결과 관련 타입
export interface TestResultData {
	title: string;
	description: string;
	characteristics: string[];
	emoji: string;
}

// 사용자 관련 타입
export interface User {
	id: string;
	name: string;
	email: string;
	username: string;
	createdAt: string;
	updatedAt: string;
}

// 피드백 관련 타입은 packages/supabase/types에서 가져옴
export type { Feedback } from '@repo/supabase/types';

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
