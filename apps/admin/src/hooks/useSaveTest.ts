/**
 * @hook useSaveTest
 * @description 테스트 저장 (생성 + 수정) Mutation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '@/services/test.service';
import { queryKeys } from '@/shared/lib/query-client';
import type { Database } from '@pickid/supabase';

type TestInsert = Database['public']['Tables']['tests']['Insert'];
type TestQuestionInsert = Database['public']['Tables']['test_questions']['Insert'];
type TestResultInsert = Database['public']['Tables']['test_results']['Insert'];

interface ISaveTestParams {
	testData: TestInsert;
	questionsData: TestQuestionInsert[];
	resultsData: TestResultInsert[];
}

export const useSaveTest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ testData, questionsData, resultsData }: ISaveTestParams) =>
			testService.saveCompleteTest(testData, questionsData, resultsData),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.tests.all });
			if (variables.testData.id) {
				queryClient.invalidateQueries({ queryKey: queryKeys.tests.detail(variables.testData.id) });
			}
		},
	});
};
