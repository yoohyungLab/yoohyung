import { useState, useCallback, useEffect, useMemo } from 'react';
import { UserResponsesService } from '@/shared/api/services/user-responses.service';
import type { UserResponse, ResponseFilters, ResponseStats } from '@/shared/api/services/user-responses.service';

interface UserResponseFilters {
	search?: string;
	testId?: string;
	category?: string;
	device?: string;
	dateFrom?: string;
	dateTo?: string;
}

export const useUserResponses = () => {
	const [responses, setResponses] = useState<UserResponse[]>([]);
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
	const stats = useMemo((): ResponseStats => {
		if (responses.length === 0) {
			return {
				total_responses: 0,
				completed_responses: 0,
				completion_rate: 0,
				avg_completion_time: 0,
				mobile_count: 0,
				desktop_count: 0,
				mobile_ratio: 0,
				stats_generated_at: new Date().toISOString(),
			};
		}

		const completed = responses.filter((r) => r.completed_at);
		const mobile = responses.filter((r) => r.device_type === 'mobile');
		const totalTime = responses.reduce((sum, r) => sum + (r.completion_time_seconds || 0), 0);

		return {
			total_responses: responses.length,
			completed_responses: completed.length,
			completion_rate: responses.length > 0 ? (completed.length / responses.length) * 100 : 0,
			avg_completion_time: completed.length > 0 ? totalTime / completed.length : 0,
			mobile_count: mobile.length,
			desktop_count: responses.length - mobile.length,
			mobile_ratio: responses.length > 0 ? (mobile.length / responses.length) * 100 : 0,
			stats_generated_at: new Date().toISOString(),
		};
	}, [responses]);

	// 필터링된 응답
	const filteredResponses = useMemo(() => {
		return responses.filter((response) => {
			const matchesSearch =
				!filters.search ||
				response.test_title?.toLowerCase().includes(filters.search.toLowerCase()) ||
				response.category_names?.some((cat) => cat.toLowerCase().includes(filters.search.toLowerCase())) ||
				response.result_name?.toLowerCase().includes(filters.search.toLowerCase());
			const matchesTestId = filters.testId === 'all' || response.test_id === filters.testId;
			const matchesCategory = filters.category === 'all' || response.category_ids?.includes(filters.category);
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

	// 데이터 내보내기
	const exportToCSV = useCallback(async () => {
		try {
			const apiFilters: ResponseFilters = {
				test_id: filters.testId === 'all' ? undefined : filters.testId,
				category_id: filters.category === 'all' ? undefined : filters.category,
				device_type: filters.device === 'all' ? undefined : filters.device,
				date_from: filters.dateFrom ? filters.dateFrom + 'T00:00:00Z' : undefined,
				date_to: filters.dateTo ? filters.dateTo + 'T23:59:59Z' : undefined,
				search_query: filters.search || undefined,
			};

			const blob = await UserResponsesService.exportToCSV(apiFilters);
			const filename = `user-responses-${new Date().toISOString().split('T')[0]}.csv`;
			UserResponsesService.downloadFile(blob, filename);
			return true;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'CSV 내보내기에 실패했습니다.');
			return false;
		}
	}, [filters]);

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
		exportToCSV,
		updateFilters,
	};
};
