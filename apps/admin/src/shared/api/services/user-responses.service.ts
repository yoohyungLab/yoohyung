import { supabase } from '@pickid/supabase';
import type { UserTestResponse } from '@pickid/supabase';

export interface UserResponse extends UserTestResponse {
	test_title: string;
	test_slug: string;
	category_names: string[];
	result_name: string | null;
}

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

export interface ResponseChartData {
	daily_responses: Array<{ date: string; count: number }>;
	device_breakdown: Array<{ device: string; count: number }>;
	result_breakdown: Array<{ result: string; count: number }>;
	period_days: number;
	generated_at: string;
}

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

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

export const userResponsesService = {
	async getResponses(): Promise<UserResponse[]> {
		try {
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

			if (error) throw error;
			const categoryIds = new Set<string>();
			(data || []).forEach((item: Record<string, unknown>) => {
				const test = item.tests as Record<string, unknown>;
				const testCategoryIds = (test?.category_ids as string[]) || [];
				testCategoryIds.forEach((id) => categoryIds.add(id));
			});

			const { data: categoriesData } = await supabase
				.from('categories')
				.select('id, name')
				.in('id', Array.from(categoryIds));

			const categoriesMap = new Map<string, string>();
			(categoriesData || []).forEach((cat: Record<string, unknown>) => {
				categoriesMap.set(cat.id as string, cat.name as string);
			});

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
		} catch (error) {
			handleSupabaseError(error, 'getResponses');
			throw error;
		}
	},

	async getResponsesWithFilters(filters: ResponseFilters = {}): Promise<UserResponse[]> {
		try {
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

			if (filters.search_query) {
				query = query.ilike('tests.title', `%${filters.search_query}%`);
			}

			query = query
				.order('completed_at', { ascending: false })
				.range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20) - 1);

			const { data, error } = await query;

			if (error) throw error;
			const categoryIds = new Set<string>();
			(data || []).forEach((item: Record<string, unknown>) => {
				const test = item.tests as Record<string, unknown>;
				const testCategoryIds = (test?.category_ids as string[]) || [];
				testCategoryIds.forEach((id) => categoryIds.add(id));
			});

			const { data: categoriesData } = await supabase
				.from('categories')
				.select('id, name')
				.in('id', Array.from(categoryIds));

			const categoriesMap = new Map<string, string>();
			(categoriesData || []).forEach((cat: Record<string, unknown>) => {
				categoriesMap.set(cat.id as string, cat.name as string);
			});

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
		} catch (error) {
			handleSupabaseError(error, 'getResponsesWithFilters');
			throw error;
		}
	},

	async getResponseStats(filters: ResponseFilters = {}): Promise<ResponseStats> {
		try {
			let query = supabase.from('user_test_responses').select('id, completed_at, completion_time_seconds, device_type');

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

			if (error) throw error;

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
		} catch (error) {
			handleSupabaseError(error, 'getResponseStats');
			throw error;
		}
	},

	async getResponseDetail(responseId: string): Promise<UserResponseDetail | null> {
		try {
			const { data, error } = await supabase
			.from('user_test_responses')
			.select(
				`
                id, user_id, test_id, started_at, completed_at, completion_time_seconds, device_type, ip_address, user_agent, referrer,
                tests:tests(id, title, slug, type),
                test_results:result(id, result_name, description)
                `
			)
				.eq('id', responseId)
				.single();

			if (error) throw error;

			if (!data) return null;

			const test = (data as any).tests;
			const result = (data as any).test_results;

			return {
				...(data as any),
				test: { id: test?.id, title: test?.title, slug: test?.slug, type: test?.type },
				result: result ? { id: result.id, name: result.result_name, description: result.description } : null,
				timing: {
					started_at: (data as any).started_at,
					completed_at: (data as any).completed_at,
					duration_seconds: (data as any).completion_time_seconds,
				},
				environment: {
					ip_address: (data as any).ip_address,
					user_agent: (data as any).user_agent,
					device_type: (data as any).device_type,
					referrer: (data as any).referrer,
				},
			} as unknown as UserResponseDetail;
		} catch (error) {
			handleSupabaseError(error, 'getResponseDetail');
			throw error;
		}
	},

	async deleteResponse(responseId: string): Promise<boolean> {
		try {
			const { error } = await supabase.from('user_test_responses').delete().eq('id', responseId);
			if (error) throw error;
			return true;
		} catch (error) {
			handleSupabaseError(error, 'deleteResponse');
			throw error;
		}
	},

	async getResponsesCount(filters: ResponseFilters = {}): Promise<number> {
		try {
			let query = supabase.from('user_test_responses').select('id', { count: 'exact', head: true });
			if (filters.test_id) query = query.eq('test_id', filters.test_id);
			if (filters.device_type) query = query.eq('device_type', filters.device_type);
			if (filters.date_from) query = query.gte('completed_at', filters.date_from);
			if (filters.date_to) query = query.lte('completed_at', filters.date_to);
			const { count, error } = await query;
			if (error) throw error;
			return count || 0;
		} catch (error) {
			handleSupabaseError(error, 'getResponsesCount');
			throw error;
		}
	},

	async getQuickStats(): Promise<{
		today_responses: number;
		total_responses: number;
		avg_completion_rate: number;
		top_device: string;
	}> {
		try {
			const { count: total } = await supabase.from('user_test_responses').select('id', { count: 'exact', head: true });
			const todayStart = new Date();
			todayStart.setHours(0, 0, 0, 0);
			const { count: today } = await supabase
				.from('user_test_responses')
				.select('id', { count: 'exact', head: true })
				.gte('created_at', todayStart.toISOString());

			const { data: deviceRows } = await supabase
				.from('user_test_responses')
				.select('device_type')
				.not('device_type', 'is', null);
			const deviceCounts = new Map<string, number>();
			(deviceRows || []).forEach((r: { device_type: string | null }) => {
				if (!r.device_type) return;
				deviceCounts.set(r.device_type, (deviceCounts.get(r.device_type) || 0) + 1);
			});
			let topDevice = 'unknown';
			let topCount = 0;
			deviceCounts.forEach((cnt, dev) => {
				if (cnt > topCount) {
					topCount = cnt;
					topDevice = dev;
				}
			});

			const { data: completedRows } = await supabase.from('user_test_responses').select('id, completed_at');
			const completed = (completedRows || []).filter((r: { completed_at: string | null }) => r.completed_at).length;
			const avgCompletionRate = total && total > 0 ? Math.round((completed / total) * 100) : 0;

			return {
				today_responses: today || 0,
				total_responses: total || 0,
				avg_completion_rate: avgCompletionRate,
				top_device: topDevice,
			};
		} catch (error) {
			handleSupabaseError(error, 'getQuickStats');
			throw error;
		}
	},
};

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
