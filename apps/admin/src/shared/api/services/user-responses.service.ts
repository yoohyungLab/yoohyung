// apps/admin/src/shared/api/services/user-responses.service.ts
import { supabase } from '@pickid/supabase';
import type { Database } from '@pickid/supabase';

// 타입 정의
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];

export type UserTestResponse = Tables<'user_test_responses'>['Row'];
export type Test = Tables<'tests'>['Row'];
export type TestResult = Tables<'test_results'>['Row'];

// UI용 확장 타입
export interface UserResponse extends UserTestResponse {
	test_title: string;
	test_slug: string;
	category_names: string[];
	result_name: string | null;
}

// 필터 타입
export interface ResponseFilters {
	test_id?: string;
	category_id?: string;
	device_type?: UserTestResponse['device_type'];
	date_from?: string;
	date_to?: string;
	search_query?: string;
	limit?: number;
	offset?: number;
}

// 통계 타입
export interface ResponseStats {
	total_responses: number;
	completed_responses: number;
	completion_rate: number;
	avg_completion_time: number;
	mobile_count: number;
	desktop_count: number;
	mobile_ratio: number;
	stats_generated_at: string;
}

// 차트 데이터 타입
export interface ResponseChartData {
	daily_responses: Array<{ date: string; count: number }>;
	device_breakdown: Array<{ device: string; count: number }>;
	result_breakdown: Array<{ result: string; count: number }>;
	period_days: number;
	generated_at: string;
}

// 상세 정보 타입
export interface UserResponseDetail extends UserTestResponse {
	test: { id: string; title: string; slug: string; type: string };
	result: { id: string; name: string; description: string | null } | null;
	timing: { started_at: string | null; completed_at: string | null; duration_seconds: number | null };
	environment: {
		ip_address: string | null;
		user_agent: string | null;
		device_type: string | null;
		referrer: string | null;
	};
}

// 내보내기 데이터 타입
export interface ExportData {
	response_id: string;
	test_title: string;
	result_name: string;
	score: UserTestResponse['total_score'];
	completed_at: UserTestResponse['completed_at'];
	duration_seconds: UserTestResponse['completion_time_seconds'];
	device_type: UserTestResponse['device_type'];
	responses_json: string;
}

export class UserResponsesService {
	/**
	 * 사용자 응답 목록 조회 (간단한 버전)
	 */
	static async getResponses(): Promise<UserResponse[]> {
		// RPC 함수 대신 직접 쿼리 사용
		const { data, error } = await supabase
			.from('user_test_responses')
			.select(
				`
				id,
				test_id,
				session_id,
				started_at,
				completed_at,
				completion_time_seconds,
				total_score,
				device_type,
				ip_address,
				user_agent,
				referrer,
				responses,
				tests!inner(
					id,
					title,
					slug,
					category_ids
				),
				test_results(
					id,
					result_name
				)
			`
			)
			.order('completed_at', { ascending: false })
			.limit(1000);

		if (error) throw new Error(`사용자 응답 조회 실패: ${error.message}`);

		// 카테고리 정보를 별도로 조회
		const categoryIds = new Set<string>();
		(data || []).forEach((item: Record<string, unknown>) => {
			const test = item.tests as Record<string, unknown>;
			const testCategoryIds = (test?.category_ids as string[]) || [];
			testCategoryIds.forEach((id) => categoryIds.add(id));
		});

		// 카테고리 정보 조회
		const { data: categoriesData } = await supabase
			.from('categories')
			.select('id, name')
			.in('id', Array.from(categoryIds));

		const categoriesMap = new Map<string, string>();
		(categoriesData || []).forEach((cat: Record<string, unknown>) => {
			categoriesMap.set(cat.id as string, cat.name as string);
		});

		// 데이터 변환
		return (data || []).map((item: Record<string, unknown>) => {
			const test = item.tests as Record<string, unknown>;
			const testCategoryIds = (test?.category_ids as string[]) || [];
			const categoryNames = testCategoryIds.map((id) => categoriesMap.get(id)).filter(Boolean);

			return {
				...item,
				test_title: (test?.title as string) || '',
				test_slug: (test?.slug as string) || '',
				category_names: categoryNames,
				result_name: ((item.test_results as Record<string, unknown>)?.result_name as string) || null,
			};
		}) as UserResponse[];
	}

	/**
	 * 사용자 응답 목록 조회 (필터링 포함)
	 */
	static async getResponsesWithFilters(filters: ResponseFilters = {}): Promise<UserResponse[]> {
		let query = supabase.from('user_test_responses').select(`
				id,
				test_id,
				session_id,
				started_at,
				completed_at,
				completion_time_seconds,
				total_score,
				device_type,
				ip_address,
				user_agent,
				referrer,
				responses,
				tests!inner(
					id,
					title,
					slug,
					category_ids
				),
				test_results(
					id,
					result_name
				)
			`);

		// 필터 적용
		if (filters.test_id) {
			query = query.eq('test_id', filters.test_id);
		}

		if (filters.device_type) {
			query = query.eq('device_type', filters.device_type);
		}

		if (filters.date_from) {
			query = query.gte('completed_at', filters.date_from);
		}

		if (filters.date_to) {
			query = query.lte('completed_at', filters.date_to);
		}

		// 검색 쿼리 (테스트 제목에서 검색)
		if (filters.search_query) {
			query = query.ilike('tests.title', `%${filters.search_query}%`);
		}

		query = query
			.order('completed_at', { ascending: false })
			.range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20) - 1);

		const { data, error } = await query;

		if (error) throw new Error(`사용자 응답 조회 실패: ${error.message}`);

		// 카테고리 정보를 별도로 조회
		const categoryIds = new Set<string>();
		(data || []).forEach((item: Record<string, unknown>) => {
			const test = item.tests as Record<string, unknown>;
			const testCategoryIds = (test?.category_ids as string[]) || [];
			testCategoryIds.forEach((id) => categoryIds.add(id));
		});

		// 카테고리 정보 조회
		const { data: categoriesData } = await supabase
			.from('categories')
			.select('id, name')
			.in('id', Array.from(categoryIds));

		const categoriesMap = new Map<string, string>();
		(categoriesData || []).forEach((cat: Record<string, unknown>) => {
			categoriesMap.set(cat.id as string, cat.name as string);
		});

		// 데이터 변환
		return (data || []).map((item: Record<string, unknown>) => {
			const test = item.tests as Record<string, unknown>;
			const testCategoryIds = (test?.category_ids as string[]) || [];
			const categoryNames = testCategoryIds.map((id) => categoriesMap.get(id)).filter(Boolean);

			return {
				...item,
				test_title: (test?.title as string) || '',
				test_slug: (test?.slug as string) || '',
				category_names: categoryNames,
				result_name: ((item.test_results as Record<string, unknown>)?.result_name as string) || null,
			};
		}) as UserResponse[];
	}

	/**
	 * 사용자 응답 통계 조회 (직접 쿼리 사용)
	 */
	static async getResponseStats(filters: ResponseFilters = {}): Promise<ResponseStats> {
		let query = supabase.from('user_test_responses').select('id, completed_at, completion_time_seconds, device_type');

		// 필터 적용
		if (filters.test_id) {
			query = query.eq('test_id', filters.test_id);
		}

		if (filters.device_type) {
			query = query.eq('device_type', filters.device_type);
		}

		if (filters.date_from) {
			query = query.gte('completed_at', filters.date_from);
		}

		if (filters.date_to) {
			query = query.lte('completed_at', filters.date_to);
		}

		const { data, error } = await query;

		if (error) throw new Error(`통계 조회 실패: ${error.message}`);

		const responses = data || [];
		const completed = responses.filter((r) => r.completed_at);
		const mobile = responses.filter((r) => r.device_type === 'mobile');
		const desktop = responses.filter((r) => r.device_type === 'desktop');
		const totalTime = completed.reduce((sum, r) => sum + (r.completion_time_seconds || 0), 0);

		return {
			total_responses: responses.length,
			completed_responses: completed.length,
			completion_rate: responses.length > 0 ? (completed.length / responses.length) * 100 : 0,
			avg_completion_time: completed.length > 0 ? totalTime / completed.length : 0,
			mobile_count: mobile.length,
			desktop_count: desktop.length,
			mobile_ratio: responses.length > 0 ? (mobile.length / responses.length) * 100 : 0,
			stats_generated_at: new Date().toISOString(),
		};
	}

	/**
	 * 특정 응답 상세 조회 (RPC 함수 사용)
	 */
	static async getResponseDetail(responseId: string): Promise<UserResponseDetail | null> {
		const { data, error } = await supabase.rpc('get_user_response_detail', {
			response_uuid: responseId,
		});

		if (error) throw new Error(`응답 상세 조회 실패: ${error.message}`);
		return data || null;
	}

	/**
	 * 응답 삭제 (RPC 함수 사용)
	 */
	static async deleteResponse(responseId: string): Promise<boolean> {
		const { data, error } = await supabase.rpc('delete_user_response', {
			response_uuid: responseId,
		});

		if (error) throw new Error(`응답 삭제 실패: ${error.message}`);
		return data || false;
	}

	/**
	 * 응답 데이터 내보내기 (RPC 함수 사용)
	 */
	static async exportResponses(filters: { test_id?: string } = {}): Promise<ExportData[]> {
		const { data, error } = await supabase.rpc('export_user_responses', {
			test_uuid: filters.test_id || null,
			limit_count: 10000,
			offset_count: 0,
		});

		if (error) throw new Error(`데이터 내보내기 실패: ${error.message}`);

		return (data || []).map((item: unknown) => {
			const exportItem = item as Record<string, unknown>;
			return {
				response_id: exportItem.id as string,
				test_title: (exportItem.test_title as string) || '',
				result_name: (exportItem.result_name as string) || '',
				score: exportItem.score as number | null,
				completed_at: exportItem.completed_at as string | null,
				duration_seconds: exportItem.completion_time_seconds as number | null,
				device_type: exportItem.device_type as string | null,
				responses_json: JSON.stringify(exportItem.responses),
			};
		});
	}

	/**
	 * 응답 통계 차트 데이터 조회 (RPC 함수 사용)
	 */
	static async getChartData(testId: string, daysBack: number = 30): Promise<ResponseChartData> {
		const { data, error } = await supabase.rpc('get_responses_chart_data', {
			test_uuid: testId,
			days: daysBack,
		});

		if (error) throw new Error(`차트 데이터 조회 실패: ${error.message}`);

		const chartData = data || [];
		const daily_responses = chartData.map((item: unknown) => {
			const chartItem = item as Record<string, unknown>;
			return {
				date: chartItem.date as string,
				count: chartItem.responses as number,
			};
		});

		return {
			daily_responses,
			device_breakdown: [
				{ device: 'mobile', count: 0 },
				{ device: 'desktop', count: 0 },
				{ device: 'tablet', count: 0 },
			],
			result_breakdown: [{ result: '알 수 없음', count: 0 }],
			period_days: daysBack,
			generated_at: new Date().toISOString(),
		};
	}

	/**
	 * 응답 개수 조회 (페이지네이션용, RPC 함수 사용)
	 */
	static async getResponsesCount(filters: ResponseFilters = {}): Promise<number> {
		const { data, error } = await supabase.rpc('get_user_responses_count', {
			test_id_filter: filters.test_id || null,
			category_filter: filters.category_id || null,
			device_filter: filters.device_type || null,
			date_from: filters.date_from || null,
			date_to: filters.date_to || null,
			search_query: filters.search_query || null,
		});

		if (error) throw new Error(`응답 개수 조회 실패: ${error.message}`);
		return data || 0;
	}

	/**
	 * CSV 데이터를 Blob으로 변환
	 */
	static async exportToCSV(filters: ResponseFilters = {}): Promise<Blob> {
		const responses = await this.getResponsesWithFilters({
			...filters,
			limit: Math.min(filters.limit || 10000, 50000),
		});

		if (responses.length === 0) {
			throw new Error('내보낼 데이터가 없습니다.');
		}

		const headers = [
			'응답 ID',
			'테스트명',
			'카테고리',
			'결과 유형',
			'점수',
			'응답일시',
			'소요시간(초)',
			'디바이스 타입',
			'세션 ID',
			'리퍼러',
			'IP 주소',
			'User Agent',
		];

		const escapeCsvValue = (value: unknown): string => {
			if (value === null || value === undefined) return '';
			const str = String(value);
			return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
		};

		const rows = responses.map((response) => [
			escapeCsvValue(response.id),
			escapeCsvValue(response.test_title),
			escapeCsvValue(response.category_names.join(', ')),
			escapeCsvValue(response.result_name || '없음'),
			escapeCsvValue(response.total_score || 0),
			escapeCsvValue(response.completed_at ? new Date(response.completed_at).toLocaleString('ko-KR') : '미완료'),
			escapeCsvValue(response.completion_time_seconds || 0),
			escapeCsvValue(ResponseUtils.formatDeviceType(response.device_type)),
			escapeCsvValue(response.session_id),
			escapeCsvValue(response.referrer || ''),
			escapeCsvValue(response.ip_address || ''),
			escapeCsvValue(response.user_agent || ''),
		]);

		const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
		const BOM = '\uFEFF';

		return new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
	}

	/**
	 * 파일 다운로드 헬퍼
	 */
	static downloadFile(blob: Blob, filename: string): void {
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	/**
	 * 응답 통계 요약 (대시보드용, RPC 함수 사용)
	 */
	static async getQuickStats(): Promise<{
		today_responses: number;
		total_responses: number;
		avg_completion_rate: number;
		top_device: string;
	}> {
		try {
			const { data, error } = await supabase.rpc('get_user_responses_summary');

			if (error) throw new Error(`요약 통계 조회 실패: ${error.message}`);

			const stats = data as Record<string, unknown>;
			return {
				today_responses: (stats.today_responses as number) || 0,
				total_responses: (stats.total_responses as number) || 0,
				avg_completion_rate: (stats.avg_completion_rate as number) || 0,
				top_device: (stats.top_device as string) || 'unknown',
			};
		} catch (error) {
			console.error('Failed to fetch quick stats:', error);
			return { today_responses: 0, total_responses: 0, avg_completion_rate: 0, top_device: 'unknown' };
		}
	}
}

// 유틸리티 함수
export const ResponseUtils = {
	formatDuration(seconds: number | null): string {
		if (!seconds) return '0초';
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return minutes > 0 ? `${minutes}분 ${remainingSeconds}초` : `${remainingSeconds}초`;
	},

	formatDeviceType(deviceType: string | null): string {
		if (!deviceType) return '알 수 없음';
		switch (deviceType.toLowerCase()) {
			case 'mobile':
				return '모바일';
			case 'desktop':
				return '데스크톱';
			case 'tablet':
				return '태블릿';
			default:
				return deviceType;
		}
	},

	getResponseStatus(response: UserResponse): 'completed' | 'started' | 'abandoned' {
		if (response.completed_at) return 'completed';
		if (response.started_at) return 'started';
		return 'abandoned';
	},

	validateDateRange(dateFrom: string, dateTo: string): boolean {
		return new Date(dateFrom) <= new Date(dateTo);
	},

	calculatePagination(currentPage: number, itemsPerPage: number, totalItems: number) {
		const totalPages = Math.ceil(totalItems / itemsPerPage);
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

		return {
			totalPages,
			hasNextPage: currentPage < totalPages,
			hasPrevPage: currentPage > 1,
			startIndex: startIndex + 1,
			endIndex,
		};
	},
};

export default UserResponsesService;
