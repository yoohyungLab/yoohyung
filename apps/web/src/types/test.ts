/**
 * Test Types
 *
 * 테스트 관련 타입을 정의합니다.
 */

import type { TestResult } from '@pickid/supabase';

// 테스트 타입 정의
export type TTestType = 'balance' | 'psychology' | 'personality' | 'quiz';

// 테스트 완료 결과 (클라이언트 전용)
export interface TestCompletionResult extends Pick<TestResult, 'test_id' | 'created_at'> {
	resultId: string;
	totalScore: number;
	score: number;
	answers: Array<{
		questionId: string;
		choiceId: string;
		score: number;
		code?: string;
		answeredAt: number;
	}>;
	completedAt: string;
	duration: number;
	gender?: string;
}
