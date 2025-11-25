import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { testService } from '@/api/services/test.service';
import type { IPopularTest } from '@/types';

const CATEGORY_MAP: Record<string, string> = {
	quiz: '퀴즈',
	balance: '밸런스게임',
	psychology: '심리테스트',
};

interface IUsePopularTestsProps {
	currentTestId: string;
	limit?: number;
	enabled?: boolean;
}

export function usePopularTests({ currentTestId, limit = 3, enabled = true }: IUsePopularTestsProps) {
	const { data: allTests, isLoading } = useQuery({
		queryKey: ['published-tests'],
		queryFn: () => testService.getPublishedTests(),
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		enabled,
	});

	const popularTests = useMemo<IPopularTest[]>(() => {
		if (!allTests?.length) return [];

		return allTests
			.filter((test) => test.id !== currentTestId)
			.sort((a, b) => ((b.response_count as number) || 0) - ((a.response_count as number) || 0))
			.slice(0, limit)
			.map((test) => {
				const category = CATEGORY_MAP[test.type as string] || '테스트';

				return {
					id: test.id as string,
					testId: test.id as string,
					title: test.title as string,
					description: (test.description as string) || `${category} 테스트`,
					category,
					thumbnail_url: (test.thumbnail_url as string) || '',
					thumbnailUrl: (test.thumbnail_url as string) || '',
					participantCount: (test.start_count as number) || 0,
				};
			});
	}, [allTests, currentTestId, limit]);

	return { popularTests, isLoading };
}
