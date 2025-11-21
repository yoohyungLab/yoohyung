import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userResponsesService } from '@/services/user-responses.service';
import { queryKeys } from '@/shared/lib/query-client';

interface IUserResponseFilters {
	search?: string;
	testId?: string;
	category?: string;
	device?: string;
	dateFrom?: string;
	dateTo?: string;
}

export const useUserResponses = () => {
	const queryClient = useQueryClient();
	const [filters, setFilters] = useState<IUserResponseFilters>({
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
		error: queryError,
	} = useQuery({
		queryKey: queryKeys.responses.all,
		queryFn: () => userResponsesService.getResponses(),
		staleTime: 5 * 60 * 1000,
	});

	const error = queryError ? (queryError instanceof Error ? queryError.message : '응답을 불러오는데 실패했습니다.') : null;

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
			const matchesTestId = !filters.testId || filters.testId === 'all' || response.test_id === filters.testId;
			const matchesDevice = !filters.device || filters.device === 'all' || response.device_type === filters.device;

			// 날짜 필터링
			let matchesDate = true;
			if (filters.dateFrom && response.completed_at) {
				matchesDate = matchesDate && new Date(response.completed_at) >= new Date(filters.dateFrom);
			}
			if (filters.dateTo && response.completed_at) {
				const endOfDay = `${filters.dateTo}T23:59:59`;
				matchesDate = matchesDate && new Date(response.completed_at) <= new Date(endOfDay);
			}

			return matchesTestId && matchesDevice && matchesDate;
		});
	}, [responses, filters]);

	// 응답 삭제
	const deleteResponseMutation = useMutation({
		mutationFn: (id: string) => userResponsesService.deleteResponse(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.responses.all });
		},
	});

	// 대량 삭제
	const bulkDeleteResponsesMutation = useMutation({
		mutationFn: (responseIds: string[]) =>
			Promise.all(responseIds.map((id) => userResponsesService.deleteResponse(id))),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.responses.all });
		},
	});

	// 필터 업데이트
	const updateFilters = useCallback((newFilters: Partial<IUserResponseFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	return {
		responses: filteredResponses,
		loading: isLoading,
		error,
		filters,
		stats,
		deleteResponse: deleteResponseMutation.mutateAsync,
		bulkDeleteResponses: bulkDeleteResponsesMutation.mutateAsync,
		updateFilters,
	};
};
