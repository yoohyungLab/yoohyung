// apps/admin/src/shared/api/services/user-responses.service.ts
import { supabase } from '@repo/supabase';

// TODO: user-responses에 있는 타입 전부 제거하기
export interface UserResponse {
	id: string;
	test_id: string;
	test_title: string;
	test_slug: string;
	category_names: string[];
	user_id: string | null;
	session_id: string;
	result_id: string | null;
	result_name: string | null;
	total_score: number | null;
	started_at: string | null;
	completed_at: string | null;
	completion_time_seconds: number | null;
	ip_address: string | null;
	user_agent: string | null;
	referrer: string | null;
	device_type: string | null;
	responses: Record<string, unknown>;
	created_at: string;
}

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

export interface ResponseFilters {
	test_id?: string;
	category_id?: string;
	device_type?: string;
	date_from?: string;
	date_to?: string;
	search_query?: string;
	limit?: number;
	offset?: number;
}

export interface ResponseChartData {
	daily_responses: Array<{
		date: string;
		count: number;
	}>;
	device_breakdown: Array<{
		device: string;
		count: number;
	}>;
	result_breakdown: Array<{
		result: string;
		count: number;
	}>;
	period_days: number;
	generated_at: string;
}

export interface UserResponseDetail {
	id: string;
	test: {
		id: string;
		title: string;
		slug: string;
		type: string;
	};
	user_id: string | null;
	session_id: string;
	result: {
		id: string;
		name: string;
		description: string;
	} | null;
	score: number | null;
	timing: {
		started_at: string | null;
		completed_at: string | null;
		duration_seconds: number | null;
	};
	environment: {
		ip_address: string | null;
		user_agent: string | null;
		device_type: string | null;
		referrer: string | null;
	};
	responses: Record<string, unknown>;
	created_at: string;
}

export interface ExportData {
	response_id: string;
	test_title: string;
	result_name: string;
	score: number | null;
	completed_at: string | null;
	duration_seconds: number | null;
	device_type: string | null;
	responses_json: string;
}

export class UserResponsesService {
	/**
	 * 사용자 응답 목록 조회 (필터링/페이지네이션 지원)
	 */
	static async getResponses(filters: ResponseFilters = {}): Promise<UserResponse[]> {
		try {
			// 입력 검증
			if (filters.limit && (filters.limit < 1 || filters.limit > 1000)) {
				throw new Error('페이지 크기는 1-1000 사이여야 합니다.');
			}
			if (filters.offset && filters.offset < 0) {
				throw new Error('오프셋은 0 이상이어야 합니다.');
			}

			// SQL 함수 대신 직접 쿼리 사용
			let query = supabase
				.from('user_test_responses')
				.select(
					`
					id,
					test_id,
					user_id,
					session_id,
					result_id,
					total_score,
					started_at,
					completed_at,
					completion_time_seconds,
					ip_address,
					user_agent,
					referrer,
					device_type,
					responses,
					created_at,
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
				.not('completed_at', 'is', null)
				.order('completed_at', { ascending: false });

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

			// 페이지네이션
			const limit = filters.limit || 20;
			const offset = filters.offset || 0;
			query = query.range(offset, offset + limit - 1);

			const { data, error } = await query;

			if (error) {
				console.error('Error fetching user responses:', error);
				throw new Error(`사용자 응답 조회 실패: ${error.message}`);
			}

			// 카테고리 정보 가져오기
			const categoryIds = [...new Set((data || []).flatMap((item: any) => item.tests?.category_ids || []))];
			let categoryMap: Record<string, string> = {};

			if (categoryIds.length > 0) {
				const { data: categories } = await supabase
					.from('categories')
					.select('id, name')
					.in('id', categoryIds)
					.eq('is_active', true);

				categoryMap = (categories || []).reduce((acc: Record<string, string>, cat: any) => {
					acc[cat.id] = cat.name;
					return acc;
				}, {} as Record<string, string>);
			}

			// 데이터 변환
			const transformedData: UserResponse[] = (data || []).map((item: any) => ({
				id: item.id,
				test_id: item.test_id,
				test_title: item.tests?.title || '',
				test_slug: item.tests?.slug || '',
				category_names: (item.tests?.category_ids || []).map((id: string) => categoryMap[id] || '알 수 없음'),
				user_id: item.user_id,
				session_id: item.session_id,
				result_id: item.result_id,
				result_name: item.test_results?.result_name || null,
				total_score: item.total_score,
				started_at: item.started_at,
				completed_at: item.completed_at,
				completion_time_seconds: item.completion_time_seconds,
				ip_address: item.ip_address,
				user_agent: item.user_agent,
				referrer: item.referrer,
				device_type: item.device_type,
				responses: item.responses,
				created_at: item.created_at,
			}));

			return transformedData;
		} catch (error) {
			console.error('Failed to fetch user responses:', error);
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('사용자 응답을 불러오는데 실패했습니다.');
		}
	}

	/**
	 * 사용자 응답 통계 조회
	 */
	static async getResponseStats(filters: ResponseFilters = {}): Promise<ResponseStats> {
		try {
			// 기본 쿼리 설정
			let query = supabase.from('user_test_responses').select('*', { count: 'exact' });

			// 필터 적용
			if (filters.test_id) {
				query = query.eq('test_id', filters.test_id);
			}
			if (filters.device_type) {
				query = query.eq('device_type', filters.device_type);
			}
			if (filters.date_from) {
				query = query.gte('created_at', filters.date_from);
			}
			if (filters.date_to) {
				query = query.lte('created_at', filters.date_to);
			}

			const { data, error, count } = await query;

			if (error) {
				console.error('Error fetching response stats:', error);
				throw new Error(`통계 조회 실패: ${error.message}`);
			}

			const responses = data || [];
			const total_responses = count || 0;
			const completed_responses = responses.filter((r) => r.completed_at).length;
			const completion_rate = total_responses > 0 ? (completed_responses / total_responses) * 100 : 0;

			const completedResponses = responses.filter((r) => r.completed_at);
			const avg_completion_time =
				completedResponses.length > 0
					? completedResponses.reduce((sum, r) => sum + (r.completion_time_seconds || 0), 0) / completedResponses.length
					: 0;

			const mobile_count = responses.filter((r) => r.device_type === 'mobile').length;
			const desktop_count = responses.filter((r) => r.device_type === 'desktop').length;
			const mobile_ratio = total_responses > 0 ? (mobile_count / total_responses) * 100 : 0;

			return {
				total_responses,
				completed_responses,
				completion_rate: Math.round(completion_rate * 10) / 10,
				avg_completion_time: Math.round(avg_completion_time),
				mobile_count,
				desktop_count,
				mobile_ratio: Math.round(mobile_ratio * 10) / 10,
				stats_generated_at: new Date().toISOString(),
			};
		} catch (error) {
			console.error('Failed to fetch response stats:', error);
			throw new Error('응답 통계를 불러오는데 실패했습니다.');
		}
	}

	/**
	 * 특정 응답 상세 조회
	 */
	static async getResponseDetail(responseId: string): Promise<UserResponseDetail | null> {
		try {
			const { data, error } = await supabase.rpc('get_user_response_detail', {
				response_id: responseId,
			});

			if (error) {
				console.error('Error fetching response detail:', error);
				throw new Error(error.message);
			}

			return data || null;
		} catch (error) {
			console.error('Failed to fetch response detail:', error);
			throw new Error('응답 상세 정보를 불러오는데 실패했습니다.');
		}
	}

	/**
	 * 응답 삭제 (관리자만)
	 */
	static async deleteResponse(responseId: string): Promise<boolean> {
		try {
			const { data, error } = await supabase.rpc('delete_user_response', {
				response_id: responseId,
			});

			if (error) {
				console.error('Error deleting response:', error);
				throw new Error(error.message);
			}

			return data === true;
		} catch (error) {
			console.error('Failed to delete response:', error);
			throw new Error('응답을 삭제하는데 실패했습니다.');
		}
	}

	/**
	 * 응답 데이터 내보내기
	 */
	static async exportResponses(
		filters: {
			test_id?: string;
			date_from?: string;
			date_to?: string;
		} = {}
	): Promise<ExportData[]> {
		try {
			const { data, error } = await supabase.rpc('export_user_responses', {
				test_id_filter: filters.test_id || null,
				date_from: filters.date_from || null,
				date_to: filters.date_to || null,
			});

			if (error) {
				console.error('Error exporting responses:', error);
				throw new Error(error.message);
			}

			return data || [];
		} catch (error) {
			console.error('Failed to export responses:', error);
			throw new Error('응답 데이터를 내보내는데 실패했습니다.');
		}
	}

	/**
	 * 응답 통계 차트 데이터 조회
	 */
	static async getChartData(testId?: string, daysBack: number = 30): Promise<ResponseChartData> {
		try {
			const { data, error } = await supabase.rpc('get_responses_chart_data', {
				test_id_filter: testId || null,
				days_back: daysBack,
			});

			if (error) {
				console.error('Error fetching chart data:', error);
				throw new Error(error.message);
			}

			return (
				data || {
					daily_responses: [],
					device_breakdown: [],
					result_breakdown: [],
					period_days: daysBack,
					generated_at: new Date().toISOString(),
				}
			);
		} catch (error) {
			console.error('Failed to fetch chart data:', error);
			throw new Error('차트 데이터를 불러오는데 실패했습니다.');
		}
	}

	/**
	 * CSV 데이터를 Blob으로 변환
	 */
	static async exportToCSV(filters: ResponseFilters = {}): Promise<Blob> {
		try {
			// 대량 내보내기 시 제한
			const exportLimit = Math.min(filters.limit || 10000, 50000);

			const responses = await this.getResponses({
				...filters,
				limit: exportLimit,
			});

			if (responses.length === 0) {
				throw new Error('내보낼 데이터가 없습니다.');
			}

			// CSV 헤더
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

			// CSV 데이터 행 - 안전한 문자열 이스케이프
			const escapeCsvValue = (value: unknown): string => {
				if (value === null || value === undefined) return '';
				const str = String(value);
				// CSV 특수문자 이스케이프
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

			// CSV 문자열 생성
			const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

			// BOM 추가 (Excel에서 한글 깨짐 방지)
			const BOM = '\uFEFF';

			return new Blob([BOM + csvContent], {
				type: 'text/csv;charset=utf-8',
			});
		} catch (error) {
			console.error('Failed to export CSV:', error);
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('CSV 내보내기에 실패했습니다.');
		}
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
	 * 응답 통계 요약 (대시보드용)
	 */
	static async getQuickStats(): Promise<{
		today_responses: number;
		total_responses: number;
		avg_completion_rate: number;
		top_device: string;
	}> {
		try {
			const today = new Date().toISOString().split('T')[0];

			const [todayStats, totalStats] = await Promise.all([
				this.getResponseStats({
					date_from: today + 'T00:00:00Z',
					date_to: today + 'T23:59:59Z',
				}),
				this.getResponseStats(),
			]);

			return {
				today_responses: todayStats.completed_responses,
				total_responses: totalStats.total_responses,
				avg_completion_rate: totalStats.completion_rate,
				top_device: totalStats.mobile_ratio > 50 ? 'mobile' : 'desktop',
			};
		} catch (error) {
			console.error('Failed to fetch quick stats:', error);
			return {
				today_responses: 0,
				total_responses: 0,
				avg_completion_rate: 0,
				top_device: 'unknown',
			};
		}
	}
}

// 타입 정의 확장
export type ResponseFilterKey = keyof ResponseFilters;
export type ResponseSortKey = 'completed_at' | 'total_score' | 'completion_time_seconds';
export type ChartPeriod = 7 | 30 | 90 | 365;

// 유틸리티 함수
export const ResponseUtils = {
	/**
	 * 완료 시간을 사람이 읽기 쉬운 형태로 변환
	 */
	formatDuration(seconds: number | null): string {
		if (!seconds) return '0초';

		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		if (minutes > 0) {
			return `${minutes}분 ${remainingSeconds}초`;
		}
		return `${remainingSeconds}초`;
	},

	/**
	 * 디바이스 타입을 한글로 변환
	 */
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

	/**
	 * 응답 상태 확인
	 */
	getResponseStatus(response: UserResponse): 'completed' | 'started' | 'abandoned' {
		if (response.completed_at) {
			return 'completed';
		} else if (response.started_at) {
			return 'started';
		}
		return 'abandoned';
	},

	/**
	 * 날짜 범위 검증
	 */
	validateDateRange(dateFrom: string, dateTo: string): boolean {
		const from = new Date(dateFrom);
		const to = new Date(dateTo);
		return from <= to;
	},

	/**
	 * 페이지네이션 정보 계산
	 */
	calculatePagination(
		currentPage: number,
		itemsPerPage: number,
		totalItems: number
	): {
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
		startIndex: number;
		endIndex: number;
	} {
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
