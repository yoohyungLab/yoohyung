import { useState, useCallback, useEffect, useMemo } from 'react';
import { UserResponsesService } from '@/shared/api/services/user-responses.service';
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
	const [responses, setResponses] = useState<UserTestResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<UserResponseFilters>({
		search: '',
		testId: 'all',
		category: 'all',
		device: 'all',
		dateFrom: '',
		dateTo: '',
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
			const matchesCategory = filters.category === 'all' || extendedResponse.category_ids?.includes(filters.category);
			const matchesDevice = filters.device === 'all' || response.device_type === filters.device;

			// 날짜 필터링
			let matchesDate = true;
			if (filters.dateFrom && response.completed_at) {
				matchesDate = matchesDate && new Date(response.completed_at) >= new Date(filters.dateFrom);
			}
			if (filters.dateTo && response.completed_at) {
				matchesDate = matchesDate && new Date(response.completed_at) <= new Date(filters.dateTo + 'T23:59:59');
			}

			return matchesSearch && matchesTestId && matchesCategory && matchesDevice && matchesDate;
		});
	}, [responses, filters]);

	// 데이터 로딩
	const loadResponses = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await UserResponsesService.getResponses();
			setResponses(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : '응답을 불러오는데 실패했습니다.');
		} finally {
			setLoading(false);
		}
	}, []);

	// 응답 삭제
	const deleteResponse = useCallback(async (id: string) => {
		try {
			await UserResponsesService.deleteResponse(id);
			setResponses((prev) => prev.filter((r) => r.id !== id));
		} catch (err) {
			setError(err instanceof Error ? err.message : '응답 삭제에 실패했습니다.');
		}
	}, []);

	// 대량 삭제
	const bulkDeleteResponses = useCallback(async (responseIds: string[]) => {
		try {
			await Promise.all(responseIds.map((id) => UserResponsesService.deleteResponse(id)));
			setResponses((prev) => prev.filter((r) => !responseIds.includes(r.id)));
		} catch (err) {
			setError(err instanceof Error ? err.message : '대량 삭제에 실패했습니다.');
		}
	}, []);

	// 필터 업데이트
	const updateFilters = useCallback((newFilters: Partial<UserResponseFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	// 초기 로딩
	useEffect(() => {
		loadResponses();
	}, [loadResponses]);

	return {
		responses: filteredResponses,
		loading,
		error,
		filters,
		stats,
		loadResponses,
		deleteResponse,
		bulkDeleteResponses,
		updateFilters,
	};
};
