/**
 * @hook useDeleteTest
 * @description 테스트 삭제 Mutation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '@/services/test.service';
import { queryKeys } from '@/shared/lib/query-client';

export const useDeleteTest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (testId: string) => testService.deleteTest(testId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.tests.all });
		},
	});
};
