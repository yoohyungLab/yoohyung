import type { TestChoice, TestResult } from '@pickid/supabase';

export interface IPsychologyQuestion {
	id: string;
	question_text: string;
	choices: Array<Pick<TestChoice, 'id' | 'choice_text' | 'score'>>;
}

export interface IPsychologyResult extends Pick<TestResult, 'result_name' | 'description'> {
	id: string;
}
