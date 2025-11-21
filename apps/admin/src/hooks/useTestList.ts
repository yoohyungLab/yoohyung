/**
 * @hook useTestList
 * @description 테스트 목록 조회
 */

import { useQuery } from '@tanstack/react-query';
import { testService } from '@/services/test.service';
import { queryKeys } from '@/shared/lib/query-client';

export const useTestList = () => {
	return useQuery({
		queryKey: queryKeys.tests.all,
		queryFn: () => testService.getTests(),
		staleTime: 5 * 60 * 1000,
	});
};
