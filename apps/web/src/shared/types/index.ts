// =========================
// [EGEN-TETO 테스트 타입]
// =========================
export type EgenTetoResult = 'egen-male' | 'egen-female' | 'teto-male' | 'teto-female' | 'mixed';
// 프로젝트 전용 타입들
export type Gender = 'male' | 'female';

// =========================
// [다른 테스트 타입은 아래에 추가]
// =========================

// =========================
// [공통 타입들]
// =========================

// Supabase 타입들은 직접 import해서 사용하세요:
// import type { Test, User, Feedback, TestResult } from '@repo/supabase';

// UI용 결과 데이터 타입 (필요시 사용)
export interface TestResultData {
	title: string;
	description: string;
	characteristics: string[];
	emoji: string;
}

// 필요시에만 사용할 공통 타입들
// export interface ApiResponse<T = unknown> { ... }
// export interface Pagination { ... }
// export interface AnalyticsEvent { ... }
