import { useQuery } from '@tanstack/react-query';
import { testService } from '@/services/test.service';
import { queryKeys } from '@pickid/shared';

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
