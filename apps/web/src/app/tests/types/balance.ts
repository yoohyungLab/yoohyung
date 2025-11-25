import type { TestQuestion, TestChoice } from '@pickid/supabase';

export interface IBalanceQuestion extends Pick<TestQuestion, 'id' | 'question_text' | 'image_url'> {
	choices: Array<Pick<TestChoice, 'id' | 'choice_text'>>;
}

export interface IBalanceStats {
	percentage: number;
	count: number;
}
