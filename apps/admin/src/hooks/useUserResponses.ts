import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userResponsesService } from '@/shared/api/services/user-responses.service';
import { queryKeys } from '@/shared/lib/query-client';
import type { UserTestResponse } from '@pickid/supabase';

interface UserResponseFilters {
	search?: string;
	testId?: string;
	category?: string;
	device?: string;
	dateFrom?: string;
	dateTo?: string;
}

export const useUserResponses = () => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<UserResponseFilters>({
		search: '',
		testId: 'all',
		category: 'all',
		device: 'all',
		dateFrom: '',
		dateTo: '',
	});

	const {
		data: responses = [],
		isLoading,
		refetch,
	} = useQuery({
		queryKey: queryKeys.responses.list({
			search: filters.search,
			testId: filters.testId,
			category: filters.category,
			device: filters.device,
			dateFrom: filters.dateFrom,
			dateTo: filters.dateTo,
		}),
		queryFn: () => userResponsesService.getResponses(),
		staleTime: 5 * 60 * 1000,
	});

	// 통계 계산 (원본 데이터 기준)
	const stats = useMemo(() => {
		if (responses.length === 0) {
			return {
				total_responses: 0,
				unique_users: 0,
				completion_rate: 0,
				avg_completion_time: 0,
			};
		}

		const completed = responses.filter((r) => r.completed_at);
		const totalTime = responses.reduce((sum, r) => sum + (r.completion_time_seconds || 0), 0);

		return {
			total_responses: responses.length,
			unique_users: new Set(responses.map((r) => r.user_id)).size,
			completion_rate: responses.length > 0 ? (completed.length / responses.length) * 100 : 0,
			avg_completion_time: completed.length > 0 ? totalTime / completed.length : 0,
		};
	}, [responses]);

	// 필터링된 응답
	const filteredResponses = useMemo(() => {
		return responses.filter((response) => {
			const extendedResponse = response as UserTestResponse & {
				test_title?: string;
				category_names?: string[];
				result_name?: string;
				category_ids?: string[];
			};

			const matchesSearch =
				!filters.search ||
				extendedResponse.test_title?.toLowerCase().includes(filters.search.toLowerCase()) ||
				extendedResponse.category_names?.some((cat: string) =>
					cat.toLowerCase().includes(filters.search?.toLowerCase() || '')
				) ||
				extendedResponse.result_name?.toLowerCase().includes((filters.search || '').toLowerCase());
			const matchesTestId = filters.testId === 'all' || response.test_id === filters.testId;
			const matchesCategory =
				filters.category === 'all' ||
				(filters.category ? extendedResponse.category_ids?.includes(filters.category) : true);
			const matchesDevice = filters.device === 'all' || response.device_type === (filters.device as string);

			// 날짜 필터링
			let matchesDate = true;
			if (filters.dateFrom && response.completed_at) {
				matchesDate = matchesDate && new Date(response.completed_at) >= new Date(filters.dateFrom);
			}
			if (filters.dateTo && response.completed_at) {
				const endOfDay = `${filters.dateTo as string}T23:59:59`;
				matchesDate = matchesDate && new Date(response.completed_at) <= new Date(endOfDay);
			}

			return matchesSearch && matchesTestId && matchesCategory && matchesDevice && matchesDate;
		});
	}, [responses, filters]);

	const loadResponses = useCallback(async () => {
		setError(null);
		await refetch();
	}, [refetch]);

	// 응답 삭제
	const { mutateAsync: deleteResponse } = useMutation({
		mutationFn: async (id: string) => userResponsesService.deleteResponse(id),
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.responses.lists() });
			const previous = queryClient.getQueryData<UserTestResponse[]>(queryKeys.responses.lists());
			queryClient.setQueryData<UserTestResponse[]>(queryKeys.responses.lists(), (prev = []) =>
				prev.filter((r) => r.id !== id)
			);
			return { previous } as { previous?: UserTestResponse[] };
		},
		onError: (_err, _id, context) => {
			if (context?.previous) queryClient.setQueryData(queryKeys.responses.lists(), context.previous);
			setError('응답 삭제에 실패했습니다.');
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.responses.all }),
	});

	// 대량 삭제
	const { mutateAsync: bulkDeleteResponses } = useMutation({
		mutationFn: async (responseIds: string[]) =>
			Promise.all(responseIds.map((id) => userResponsesService.deleteResponse(id))),
		onMutate: async (responseIds: string[]) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.responses.lists() });
			const previous = queryClient.getQueryData<UserTestResponse[]>(queryKeys.responses.lists());
			queryClient.setQueryData<UserTestResponse[]>(queryKeys.responses.lists(), (prev = []) =>
				prev.filter((r) => !responseIds.includes(r.id))
			);
			return { previous } as { previous?: UserTestResponse[] };
		},
		onError: (_err, _vars, context) => {
			if (context?.previous) queryClient.setQueryData(queryKeys.responses.lists(), context.previous);
			setError('대량 삭제에 실패했습니다.');
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.responses.all }),
	});

	// 필터 업데이트
	const updateFilters = useCallback((newFilters: Partial<UserResponseFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	// 초기 로딩은 useQuery가 담당. 필요시 수동 refetch 사용

	return {
		responses: filteredResponses,
		loading: isLoading,
		error,
		filters,
		stats,
		loadResponses,
		deleteResponse,
		bulkDeleteResponses,
		updateFilters,
	} as const;
};
