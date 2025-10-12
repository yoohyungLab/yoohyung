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

// ============================================================================
// 타입 정의
// ============================================================================

export interface QuestionCreationData extends Omit<TestQuestion, 'id' | 'test_id' | 'created_at' | 'updated_at'> {
	choices: ChoiceCreationData[];
}

export interface ChoiceCreationData extends Omit<TestChoice, 'id' | 'question_id' | 'created_at'> {
	score_value?: number; // score 필드의 별칭 (옵셔널로 변경)
}

export interface ResultCreationData extends Omit<TestResult, 'id' | 'test_id' | 'created_at' | 'updated_at'> {
	result_type?: string; // 추가 필드
	result_title?: string; // result_name의 별칭
	result_description?: string; // description의 별칭
	result_image_url?: string | null; // background_image_url의 별칭
	score_min?: number; // match_conditions에서 추출
	score_max?: number; // match_conditions에서 추출
	order_index?: number; // result_order의 별칭
	target_gender?: string | null; // 성별 타겟 필드 추가
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

const handleSupabaseError = (error: any, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

const validateTestData = (testId: string, data: any) => {
	if (!data) {
		throw new Error(`Test with id ${testId} not found`);
	}
	return data;
};

const validateRpcResult = (result: any, errorMessage: string) => {
	if (!result.success) {
		throw new Error(result.error || errorMessage);
	}
	return result;
};

// ============================================================================
// 테스트 서비스
// ============================================================================

export const testService = {
	/**
	 * 모든 테스트 목록 조회
	 */
	async getTests(): Promise<Test[]> {
		try {
			const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false });

			if (error) throw error;
			return data || [];
		} catch (error) {
			handleSupabaseError(error, 'getTests');
		}
	},

	/**
	 * 테스트 상세 조회 (질문, 결과 포함)
	 */
	async getTestWithDetails(testId: string): Promise<TestWithNestedDetails> {
		try {
			const { data, error } = await supabase.rpc('get_test_complete_optimized', {
				test_uuid: testId,
			});

			if (error) throw error;
			return validateTestData(testId, data) as TestWithNestedDetails;
		} catch (error) {
			handleSupabaseError(error, 'getTestWithDetails');
		}
	},

	/**
	 * 테스트 상태 변경
	 */
	async updateTestStatus(id: string, status: string): Promise<Test> {
		try {
			const { data, error } = await supabase.rpc('update_test_status', {
				test_uuid: id,
				new_status: status,
			});

			if (error) throw error;
			const result = validateRpcResult(data, '상태 변경에 실패했습니다.');
			return result.test as Test;
		} catch (error) {
			handleSupabaseError(error, 'updateTestStatus');
		}
	},

	/**
	 * 테스트 삭제
	 */
	async deleteTest(id: string): Promise<void> {
		try {
			const { data, error } = await supabase.rpc('delete_test', {
				test_uuid: id,
			});

			if (error) throw error;
			validateRpcResult(data, '테스트 삭제에 실패했습니다.');
		} catch (error) {
			handleSupabaseError(error, 'deleteTest');
		}
	},

	/**
	 * 완전한 테스트 저장 (생성/수정)
	 */
	async saveCompleteTest(
		testData: TestInsert,
		questionsData: TestQuestionInsert[],
		resultsData: TestResultInsert[]
	): Promise<TestWithNestedDetails> {
		try {
			const isUpdate = !!testData.id;
			const rpcName = isUpdate ? 'update_test_complete' : 'create_test_complete';
			const rpcParams = isUpdate
				? {
						test_uuid: testData.id,
						test_data: testData,
						questions_data: questionsData,
						results_data: resultsData,
				  }
				: {
						test_data: testData,
						questions_data: questionsData,
						results_data: resultsData,
				  };

			const { data: result, error } = await supabase.rpc(rpcName, rpcParams);

			if (error) throw error;

			// 🔧 임시 수정: RPC 함수가 requires_gender를 제대로 업데이트하지 않는 문제 해결
			// update_test_complete RPC 함수를 수정하기 전까지 직접 UPDATE 실행
			if (isUpdate && testData.id && testData.requires_gender !== undefined) {
				const { error: updateError } = await supabase
					.from('tests')
					.update({
						requires_gender: testData.requires_gender,
					})
					.eq('id', testData.id);

				if (updateError) {
					throw updateError;
				}
			}

			return result as TestWithNestedDetails;
		} catch (error) {
			handleSupabaseError(error, 'saveCompleteTest');
		}
	},
};
