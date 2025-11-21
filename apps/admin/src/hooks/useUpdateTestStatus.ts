/**
 * @hook useUpdateTestStatus
 * @description 테스트 상태 변경 Mutation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '@/services/test.service';
import { queryKeys } from '@/shared/lib/query-client';
import type { TestStatus } from '@pickid/supabase';

interface IUpdateTestStatusParams {
	id: string;
	status: TestStatus;
}

export const useUpdateTestStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, status }: IUpdateTestStatusParams) => testService.updateTestStatus(id, status),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.tests.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.tests.detail(variables.id) });
		},
	});
};
