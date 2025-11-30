import { supabase } from '@pickid/supabase';
import type { UserResponse, ResponseFilters, ResponseStats, UserResponseDetail } from '@/types/user-responses.types';

export const userResponsesService = {
	async getResponses(): Promise<UserResponse[]> {
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

		if (error) {
			throw new Error(`응답 목록 조회 실패: ${error.message}`);
		}

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
	},
	async getResponsesWithFilters(filters: ResponseFilters = {}): Promise<UserResponse[]> {
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

		if (error) {
			throw new Error(`필터링된 응답 조회 실패: ${error.message}`);
		}

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
	},
	async getResponseStats(filters: ResponseFilters = {}): Promise<ResponseStats> {
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

		if (error) {
			throw new Error(`응답 통계 조회 실패: ${error.message}`);
		}

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
	},
	async getResponseDetail(responseId: string): Promise<UserResponseDetail | null> {
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

		if (error) {
			throw new Error(`응답 상세 조회 실패: ${error.message}`);
		}

		const responseData = data as Record<string, unknown>;
		const test = responseData.tests as { id?: string; title?: string; slug?: string; type?: string } | undefined;
		const result = responseData.test_results as
			| { id?: string; result_name?: string; description?: string | null }
			| undefined;

		return {
			...responseData,
			test: { id: test?.id, title: test?.title, slug: test?.slug, type: test?.type },
			result: result ? { id: result.id, name: result.result_name, description: result.description } : null,
			timing: {
				started_at: responseData.started_at as string | null,
				completed_at: responseData.completed_at as string | null,
				duration_seconds: responseData.completion_time_seconds as number | null,
			},
			environment: {
				ip_address: responseData.ip_address as string | null,
				user_agent: responseData.user_agent as string | null,
				device_type: responseData.device_type as string | null,
				referrer: responseData.referrer as string | null,
			},
		} as unknown as UserResponseDetail;
	},
	async deleteResponse(responseId: string): Promise<boolean> {
		const { error } = await supabase.from('user_test_responses').delete().eq('id', responseId);

		if (error) {
			throw new Error(`응답 삭제 실패: ${error.message}`);
		}

		return true;
	},
	async getResponsesCount(filters: ResponseFilters = {}): Promise<number> {
		let query = supabase.from('user_test_responses').select('id', { count: 'exact', head: true });

		if (filters.test_id) query = query.eq('test_id', filters.test_id);
		if (filters.device_type) query = query.eq('device_type', filters.device_type);
		if (filters.date_from) query = query.gte('completed_at', filters.date_from);
		if (filters.date_to) query = query.lte('completed_at', filters.date_to);

		const { count, error } = await query;

		if (error) {
			throw new Error(`응답 개수 조회 실패: ${error.message}`);
		}

		return count || 0;
	},
	async getQuickStats(): Promise<{
		today_responses: number;
		total_responses: number;
		avg_completion_rate: number;
		top_device: string;
	}> {
		const { count: total, error: totalError } = await supabase
			.from('user_test_responses')
			.select('id', { count: 'exact', head: true });

		if (totalError) {
			throw new Error(`전체 응답 수 조회 실패: ${totalError.message}`);
		}

		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);

		const { count: today, error: todayError } = await supabase
			.from('user_test_responses')
			.select('id', { count: 'exact', head: true })
			.gte('created_at', todayStart.toISOString());

		if (todayError) {
			throw new Error(`오늘 응답 수 조회 실패: ${todayError.message}`);
		}

		const { data: deviceRows, error: deviceError } = await supabase
			.from('user_test_responses')
			.select('device_type')
			.not('device_type', 'is', null);

		if (deviceError) {
			throw new Error(`디바이스 통계 조회 실패: ${deviceError.message}`);
		}
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
		const { data: completedRows, error: completedError } = await supabase
			.from('user_test_responses')
			.select('id, completed_at');

		if (completedError) {
			throw new Error(`완료 통계 조회 실패: ${completedError.message}`);
		}

		const completed = (completedRows || []).filter((r: { completed_at: string | null }) => r.completed_at).length;
		const avgCompletionRate = total && total > 0 ? Math.round((completed / total) * 100) : 0;

		return {
			today_responses: today || 0,
			total_responses: total || 0,
			avg_completion_rate: avgCompletionRate,
			top_device: topDevice,
		};
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
};
