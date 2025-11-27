import type { TestChoice, TestResult } from '@pickid/supabase';

// TODO: 테스트 초이스
export interface IPsychologyQuestion {
	id: string;
	question_text: string;
	choices: Array<Pick<TestChoice, 'id' | 'choice_text' | 'score'>>;
}

export interface IPsychologyResult extends Pick<TestResult, 'result_name' | 'description'> {
	id: string;
}
