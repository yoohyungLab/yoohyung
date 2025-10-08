import { supabase } from '@pickid/shared';
import type {
	Test,
	TestInsert,
	TestQuestionInsert,
	TestResultInsert,
	TestWithNestedDetails,
	TestQuestion,
	TestChoice,
	TestResult,
} from '@pickid/supabase';

// 테스트 생성용 타입들 (Supabase 타입을 기반으로 함)
export interface QuestionCreationData extends Omit<TestQuestion, 'id' | 'test_id' | 'created_at' | 'updated_at'> {
	choices: ChoiceCreationData[];
}

export interface ChoiceCreationData extends Omit<TestChoice, 'id' | 'question_id' | 'created_at'> {
	score_value: number; // score 필드의 별칭
}

export interface ResultCreationData extends Omit<TestResult, 'id' | 'test_id' | 'created_at' | 'updated_at'> {
	result_type: string; // 추가 필드
	result_title: string; // result_name의 별칭
	result_description: string; // description의 별칭
	result_image_url?: string | null; // background_image_url의 별칭
	score_min: number; // match_conditions에서 추출
	score_max: number; // match_conditions에서 추출
	order_index: number; // result_order의 별칭
}

export const testService = {
	// 테스트 목록 조회
	async getTests(): Promise<Test[]> {
		const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
		if (error) throw error;
		return data || [];
	},

	// 상세 조회 (질문, 결과 포함)
	async getTestWithDetails(testId: string): Promise<TestWithNestedDetails> {
		const { data, error } = await supabase.rpc('get_test_complete_optimized', { test_uuid: testId });
		if (error) throw error;
		if (!data) throw new Error(`Test with id ${testId} not found`);
		return data as TestWithNestedDetails;
	},

	// 상태 변경
	async updateTestStatus(id: string, status: string): Promise<Test> {
		const { data, error } = await supabase.rpc('update_test_status', { test_uuid: id, new_status: status });
		if (error) throw error;
		if (!data.success) throw new Error(data.error || '상태 변경에 실패했습니다.');
		return data.test as Test;
	},

	// 삭제
	async deleteTest(id: string): Promise<void> {
		const { data, error } = await supabase.rpc('delete_test', { test_uuid: id });
		if (error) throw error;
		if (!data.success) throw new Error(data.error || '테스트 삭제에 실패했습니다.');
	},

	// 완전한 테스트 저장 (생성/수정)
	async saveCompleteTest(
		testData: TestInsert,
		questionsData: TestQuestionInsert[],
		resultsData: TestResultInsert[]
	): Promise<TestWithNestedDetails> {
		if (testData.id) {
			const { data: result, error } = await supabase.rpc('update_test_complete', {
				test_uuid: testData.id,
				test_data: testData,
				questions_data: questionsData,
				results_data: resultsData,
			});
			if (error) throw error;
			return result as TestWithNestedDetails;
		} else {
			const { data: result, error } = await supabase.rpc('create_test_complete', {
				test_data: testData,
				questions_data: questionsData,
				results_data: resultsData,
			});
			if (error) throw error;
			return result as TestWithNestedDetails;
		}
	},
};
