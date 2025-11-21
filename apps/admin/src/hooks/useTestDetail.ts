/**
 * @hook useTestDetail
 * @description 테스트 상세 조회 (질문, 선택지, 결과 포함)
 */

import { useQuery } from '@tanstack/react-query';
import { testService } from '@/services/test.service';
import { queryKeys } from '@/shared/lib/query-client';

interface IUseTestDetailProps {
	testId: string;
	enabled?: boolean;
}

export const useTestDetail = ({ testId, enabled = true }: IUseTestDetailProps) => {
	return useQuery({
		queryKey: queryKeys.tests.detail(testId),
		queryFn: () => testService.getTestWithDetails(testId),
		enabled: !!testId && enabled,
		staleTime: 5 * 60 * 1000,
	});
};
