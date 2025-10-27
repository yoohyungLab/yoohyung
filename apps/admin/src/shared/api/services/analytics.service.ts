import { supabase } from '@pickid/supabase';
import type { DashboardOverviewStats, Test, UserTestResponse } from '@pickid/supabase';

const handleSupabaseError = (error: unknown, context: string) => {
	console.error(`Error in ${context}:`, error);
	throw error;
};

export const analyticsService = {
	async getTestDetailedStats(testId: string) {
		try {
			const { data: testData, error: testError } = await supabase
				.from('tests')
				.select('id, title, response_count, start_count, created_at')
				.eq('id', testId)
				.single();

			if (testError) throw testError;

			const { data: responses, error: responsesError } = await supabase
				.from('user_test_responses')
				.select('id, created_at, completed_at, total_score, completion_time_seconds')
				.eq('test_id', testId);

			if (responsesError) throw responsesError;

			const responseData = responses || [];
			const totalResponses = responseData.length;
			const completedResponses = responseData.filter((r) => r.completed_at).length;
			const completionRate = totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;
			const avgScore =
				responseData.length > 0
					? responseData.reduce((sum, r) => sum + (r.total_score || 0), 0) / responseData.length
					: 0;
			const avgTime =
				responseData.length > 0
					? responseData.reduce((sum, r) => sum + (r.completion_time_seconds || 0), 0) / responseData.length
					: 0;

			return {
				testId,
				testTitle: testData?.title || '',
				totalResponses,
				completedResponses,
				completionRate: Math.round(completionRate * 100) / 100,
				avgScore: Math.round(avgScore * 100) / 100,
				avgTime: Math.round(avgTime),
				viewCount: testData?.start_count || 0,
				createdAt: testData?.created_at || '',
			};
		} catch (error) {
			handleSupabaseError(error, 'getTestDetailedStats');
			throw error;
		}
	},

	async getResponsesChartData(testId?: string, daysBack: number = 30) {
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(endDate.getDate() - daysBack);

		// 응답 데이터 조회
		try {
			const { data: responses, error: responsesError } = await supabase
				.from('user_test_responses')
				.select('created_at')
				.gte('created_at', startDate.toISOString())
				.lte('created_at', endDate.toISOString())
				.order('created_at', { ascending: true });

			if (responsesError) throw responsesError;
		const dateMap = new Map<string, number>();
		const responseData = responses || [];

		responseData.forEach((response: { created_at: string | null }) => {
			const date = new Date(response.created_at || '').toISOString().split('T')[0];
			dateMap.set(date, (dateMap.get(date) || 0) + 1);
		});

		// 차트 데이터 생성
		const chartData = Array.from(dateMap.entries()).map(([date, responses]) => ({
			date,
			responses,
		}));

			return {
				labels: chartData.map((item) => item.date),
				datasets: [
					{
						label: '일일 응답 수',
						data: chartData.map((item) => item.responses),
						backgroundColor: 'rgba(59, 130, 246, 0.1)',
						borderColor: 'rgba(59, 130, 246, 1)',
						fill: true,
					},
				],
			};
		} catch (error) {
			handleSupabaseError(error, 'getResponsesChartData');
			throw error;
		}
	},

	async getUserResponseStats(testId: string) {
		try {
			const { data: responses, error: responsesError } = await supabase
				.from('user_test_responses')
				.select('id, user_id, created_at, completed_at, total_score')
				.eq('test_id', testId);

			if (responsesError) throw responsesError;

		const responseData = responses || [];
		const totalResponses = responseData.length;
		const uniqueUsers = new Set(responseData.map((r) => r.user_id).filter(Boolean)).size;
		const completedResponses = responseData.filter((r) => r.completed_at).length;
		const avgScore =
			responseData.length > 0
				? responseData.reduce((sum, r) => sum + (r.total_score || 0), 0) / responseData.length
				: 0;

			return {
				totalResponses,
				uniqueUsers,
				completedResponses,
				completionRate: totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0,
				avgScore: Math.round(avgScore * 100) / 100,
			};
		} catch (error) {
			handleSupabaseError(error, 'getUserResponseStats');
			throw error;
		}
	},

	async getAllTestsForAnalytics(): Promise<(Test & { avg_completion_time?: number })[]> {
		try {
			const { data, error } = await supabase
				.from('tests')
				.select('id, title, slug, status, type, response_count, start_count, created_at')
				.order('created_at', { ascending: false });

			if (error) throw error;

			const tests =
				(data as Array<{
					id: string;
					title: string;
					slug: string;
					status: string | null;
					type: string | null;
					response_count: number | null;
					start_count: number | null;
					created_at: string;
				}>) || [];

			// 각 테스트의 평균 소요시간 계산
			const testsWithAvgTime = await Promise.all(
				tests.map(async (test) => {
					try {
						// 해당 테스트의 완료된 응답들의 소요시간 조회
						const { data: responses, error: responseError } = await supabase
							.from('user_test_responses')
							.select('completion_time_seconds')
							.eq('test_id', test.id)
							.not('completion_time_seconds', 'is', null);

						if (responseError) {
							return { ...test, avg_completion_time: 0 };
						}

						const completionTimes = (responses as Array<{ completion_time_seconds: number | null }>) || [];
						const avgTime =
							completionTimes.length > 0
								? Math.round(
										completionTimes.reduce(
											(sum: number, r: { completion_time_seconds: number | null }) =>
												sum + (r.completion_time_seconds || 0),
											0
										) / completionTimes.length
								  )
								: 0;

						return { ...test, avg_completion_time: avgTime };
					} catch {
						return { ...test, avg_completion_time: 0 };
					}
				})
			);

			return testsWithAvgTime;
		} catch (error) {
			handleSupabaseError(error, 'getAllTestsForAnalytics');
			throw error;
		}
	},

	async getCategoryStats(): Promise<
		Array<{
			category_id: string;
			category_name: string;
			test_count: number;
			total_responses: number;
			average_completion_rate: number;
		}>
	> {
		try {
			// 카테고리 목록 조회
			const { data: categories, error: categoryError } = await supabase
				.from('categories')
				.select('id, name')
				.eq('status', 'active')
				.order('sort_order', { ascending: true });

			if (categoryError) throw categoryError;

			// 각 카테고리별 통계 계산
			const categoryStats = await Promise.all(
				(categories || []).map(async (category: { id: string; name: string }) => {
					// 해당 카테고리의 테스트들 조회
					const { data: tests, error: testError } = await supabase
						.from('tests')
						.select('id, response_count, start_count')
						.contains('category_ids', [category.id])
						.eq('status', 'published');

					if (testError) {
						return {
							category_id: category.id,
							category_name: category.name,
							test_count: 0,
							total_responses: 0,
							average_completion_rate: 0,
						};
					}

					const testList =
						(tests as Array<{ id: string; response_count: number | null; start_count: number | null }>) || [];
					const totalResponses = testList.reduce((sum: number, test) => sum + (test.response_count || 0), 0);
					const totalViews = testList.reduce((sum: number, test) => sum + (test.start_count || 0), 0);
					const averageCompletionRate = totalViews > 0 ? (totalResponses / totalViews) * 100 : 0;

					return {
						category_id: category.id,
						category_name: category.name,
						test_count: testList.length,
						total_responses: totalResponses,
						average_completion_rate: Math.round(averageCompletionRate * 100) / 100,
					};
				})
			);

			return categoryStats;
		} catch (error) {
			handleSupabaseError(error, 'getCategoryStats');
			throw error;
		}
	},

	async getDashboardOverviewStats(): Promise<DashboardOverviewStats> {
		try {
			// 테스트 통계 조회
			const { data: tests, error: testsError } = await supabase.from('tests').select('id, status');

			if (testsError) throw testsError;

			const { data: responses, error: responsesError } = await supabase
				.from('user_test_responses')
				.select('id, completed_at, completion_time_seconds');

			if (responsesError) throw responsesError;

			const testData = tests || [];
			const responseData = responses || [];

			// 테스트 상태별 카운트
			const total = testData.length;
			const published = testData.filter((t: { id: string; status: string | null }) => t.status === 'published').length;
			const draft = testData.filter((t: { id: string; status: string | null }) => t.status === 'draft').length;
			const scheduled = testData.filter((t: { id: string; status: string | null }) => t.status === 'scheduled').length;

			// 응답 통계
			const totalResponses = responseData.length;
			const totalCompletions = responseData.filter((r: { completed_at: string | null }) => r.completed_at).length;
			const completionRate = totalResponses > 0 ? (totalCompletions / totalResponses) * 100 : 0;

			const completedResponses = responseData.filter(
				(r: { completed_at: string | null; completion_time_seconds: number | null }) => r.completed_at
			);
			const avgCompletionTime =
				completedResponses.length > 0
					? completedResponses.reduce((sum: number, r) => sum + (r.completion_time_seconds || 0), 0) /
					  completedResponses.length
					: 0;

			const result: DashboardOverviewStats = {
				total,
				published,
				draft,
				scheduled,
				totalResponses,
				totalCompletions,
				completionRate: Math.round(completionRate * 10) / 10,
				avgCompletionTime: Math.round(avgCompletionTime),
				anomalies: 0, // 이상 패턴 감지는 별도 구현 필요
			};

			return result;
		} catch (error) {
			handleSupabaseError(error, 'getDashboardOverviewStats');
			throw error;
		}
	},

	async getTestBasicStats(testId: string) {
		try {
			// 응답 데이터 조회
			const { data: responses, error: responsesError } = await supabase
				.from('user_test_responses')
				.select('id, completed_at, total_score, completion_time_seconds, device_type')
				.eq('test_id', testId);

			if (responsesError) {
				throw new Error(`응답 데이터 조회 실패: ${responsesError.message}`);
			}

			const responseData = responses || [];
			const totalResponses = responseData.length;
			const completedResponses = responseData.filter((r) => r.completed_at).length;
			const completionRate = totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;

			const avgTime =
				responseData.length > 0
					? responseData.reduce((sum, r) => sum + (r.completion_time_seconds || 0), 0) / responseData.length
					: 0;

			const avgScore =
				responseData.length > 0
					? responseData.reduce((sum, r) => sum + (r.total_score || 0), 0) / responseData.length
					: 0;

			// 디바이스별 통계
			const deviceBreakdown = {
				mobile: responseData.filter((r) => r.device_type === 'mobile').length,
				desktop: responseData.filter((r) => r.device_type === 'desktop').length,
				tablet: responseData.filter((r) => r.device_type === 'tablet').length,
			};

			return {
				totalResponses,
				completedResponses,
				completionRate: Math.round(completionRate * 100) / 100,
				avgTime: Math.round(avgTime),
				avgScore: Math.round(avgScore * 100) / 100,
				deviceBreakdown,
			};
		} catch (error) {
			handleSupabaseError(error, 'getTestBasicStats');
			throw error;
		}
	},

	async getTestAnalyticsData(testId: string, days: number = 30) {
		try {
			const endDate = new Date();
			const startDate = new Date();
			startDate.setDate(endDate.getDate() - days);

			// 테스트 기본 정보 조회
			const { data: testData, error: testError } = await supabase
				.from('tests')
				.select('id, title, description, created_at, response_count, start_count')
				.eq('id', testId)
				.single();

			if (testError) throw testError;

			const { data: responses, error: responsesError } = await supabase
				.from('user_test_responses')
				.select('id, created_at, completed_at, total_score, completion_time_seconds')
				.eq('test_id', testId)
				.gte('created_at', startDate.toISOString())
				.lte('created_at', endDate.toISOString());

			if (responsesError) throw responsesError;
			const totalResponses = responses?.length || 0;
			const completedResponses = responses?.filter((r) => r.completed_at)?.length || 0;
			const completionRate = totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;
			const avgScore =
				responses?.length > 0 ? responses.reduce((sum, r) => sum + (r.total_score || 0), 0) / responses.length : 0;
			const avgTime =
				responses?.length > 0
					? responses.reduce((sum, r) => sum + (r.completion_time_seconds || 0), 0) / responses.length
					: 0;

			return {
				testId,
				testTitle: testData?.title || '',
				period: `${days}일`,
				totalResponses,
				completedResponses,
				completionRate: Math.round(completionRate * 100) / 100,
				avgScore: Math.round(avgScore * 100) / 100,
				avgTime: Math.round(avgTime),
				dailyData: [], // 일별 데이터는 별도 구현 필요
				scoreDistribution: [],
			};
		} catch (error) {
			handleSupabaseError(error, 'getTestAnalyticsData');
			throw error;
		}
	},

	invalidateCache() {},

	async getTestTrendsData(
		testId: string,
		daysBack: number = 30
	): Promise<{
		labels: string[];
		datasets: {
			responses: number[];
			completions: number[];
			completionRates: number[];
		};
	}> {
		try {
			const { data: responses, error } = await supabase
				.from('user_test_responses')
				.select('created_at, completed_at')
				.eq('test_id', testId)
				.gte('created_at', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString())
				.order('created_at', { ascending: true });

			if (error) throw error;
			const dailyData: Record<string, { responses: number; completions: number }> = {};
			const responseData = responses || [];

			responseData.forEach((response: { created_at: string | null; completed_at: string | null }) => {
				const date = new Date(response.created_at || '').toISOString().split('T')[0];
				if (!dailyData[date]) {
					dailyData[date] = { responses: 0, completions: 0 };
				}
				dailyData[date].responses++;
				if (response.completed_at) {
					dailyData[date].completions++;
				}
			});

			// 최근 N일간의 모든 날짜 생성
			const labels: string[] = [];
			const responsesData: number[] = [];
			const completionsData: number[] = [];
			const completionRatesData: number[] = [];

			for (let i = daysBack - 1; i >= 0; i--) {
				const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
				labels.push(date);

				const dayData = dailyData[date] || { responses: 0, completions: 0 };
				responsesData.push(dayData.responses);
				completionsData.push(dayData.completions);
				completionRatesData.push(
					dayData.responses > 0 ? Math.round((dayData.completions / dayData.responses) * 100) : 0
				);
			}

			const result = {
				labels,
				datasets: {
					responses: responsesData,
					completions: completionsData,
					completionRates: completionRatesData,
				},
			};

			return result;
		} catch (error) {
			handleSupabaseError(error, 'getTestTrendsData');
			throw error;
		}
	},

	async getTestSegmentsData(testId: string): Promise<{
		deviceSegments: Array<{
			device: string;
			count: number;
			percentage: number;
			avgCompletionTime: number;
			completionRate: number;
		}>;
		timeSegments: Array<{
			hour: number;
			count: number;
			percentage: number;
			avgCompletionTime: number;
		}>;
		daySegments: Array<{
			day: string;
			count: number;
			percentage: number;
			avgCompletionTime: number;
		}>;
	}> {
		try {
			const { data: responses, error } = await supabase
				.from('user_test_responses')
				.select('device_type, created_at, completed_at, completion_time_seconds')
				.eq('test_id', testId);

			if (error) throw error;

			const responseData = responses || [];
			const totalResponses = responseData.length;

			// 디바이스별 세그먼트
			const deviceMap: Record<string, { count: number; completions: number; totalTime: number }> = {};
			responseData.forEach(
				(response: {
					device_type: string | null;
					created_at: string | null;
					completed_at: string | null;
					completion_time_seconds: number | null;
				}) => {
					const device = response.device_type || 'unknown';
					if (!deviceMap[device]) {
						deviceMap[device] = { count: 0, completions: 0, totalTime: 0 };
					}
					deviceMap[device].count++;
					if (response.completed_at) {
						deviceMap[device].completions++;
						deviceMap[device].totalTime += response.completion_time_seconds || 0;
					}
				}
			);

			const deviceSegments = Object.entries(deviceMap).map(([device, data]) => ({
				device: device.charAt(0).toUpperCase() + device.slice(1),
				count: data.count,
				percentage: totalResponses > 0 ? Math.round((data.count / totalResponses) * 100) : 0,
				avgCompletionTime: data.completions > 0 ? Math.round(data.totalTime / data.completions) : 0,
				completionRate: data.count > 0 ? Math.round((data.completions / data.count) * 100) : 0,
			}));

			// 시간대별 세그먼트
			const timeMap: Record<number, { count: number; totalTime: number }> = {};
			responseData.forEach(
				(response: {
					created_at: string | null;
					completed_at: string | null;
					completion_time_seconds: number | null;
				}) => {
					const hour = new Date(response.created_at || '').getHours();
					if (!timeMap[hour]) {
						timeMap[hour] = { count: 0, totalTime: 0 };
					}
					timeMap[hour].count++;
					if (response.completed_at) {
						timeMap[hour].totalTime += response.completion_time_seconds || 0;
					}
				}
			);

			const timeSegments = Object.entries(timeMap).map(([hour, data]) => ({
				hour: parseInt(hour),
				count: data.count,
				percentage: totalResponses > 0 ? Math.round((data.count / totalResponses) * 100) : 0,
				avgCompletionTime: data.count > 0 ? Math.round(data.totalTime / data.count) : 0,
			}));

			// 요일별 세그먼트
			const dayMap: Record<string, { count: number; totalTime: number }> = {};
			const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
			responseData.forEach(
				(response: {
					created_at: string | null;
					completed_at: string | null;
					completion_time_seconds: number | null;
				}) => {
					const day = dayNames[new Date(response.created_at || '').getDay()];
					if (!dayMap[day]) {
						dayMap[day] = { count: 0, totalTime: 0 };
					}
					dayMap[day].count++;
					if (response.completed_at) {
						dayMap[day].totalTime += response.completion_time_seconds || 0;
					}
				}
			);

			const daySegments = Object.entries(dayMap).map(([day, data]) => ({
				day,
				count: data.count,
				percentage: totalResponses > 0 ? Math.round((data.count / totalResponses) * 100) : 0,
				avgCompletionTime: data.count > 0 ? Math.round(data.totalTime / data.count) : 0,
			}));

			const result = {
				deviceSegments,
				timeSegments,
				daySegments,
			};

			return result;
		} catch (error) {
			handleSupabaseError(error, 'getTestSegmentsData');
			throw error;
		}
	},

	async getTestFunnelData(testId: string): Promise<
		Array<{
			questionId: string;
			question: string;
			reached: number;
			completed: number;
			dropoff: number;
			avgTime: number;
			order: number;
		}>
	> {
		try {
			// 테스트 질문들 조회
			const { data: questions, error: questionsError } = await supabase
				.from('test_questions')
				.select('id, question_text, question_order')
				.eq('test_id', testId)
				.order('question_order', { ascending: true });

			if (questionsError) throw questionsError;

			const { data: responses, error: responsesError } = await supabase
				.from('user_test_responses')
				.select('responses, created_at, completed_at, completion_time_seconds')
				.eq('test_id', testId);

			if (responsesError) throw responsesError;

			const questionList = (questions as Array<{ id: string; question_text: string; question_order: number }>) || [];
			const responseData =
				(responses as Array<{
					responses: unknown;
					created_at: string | null;
					completed_at: string | null;
					completion_time_seconds: number | null;
				}>) || [];

			// 각 질문별 퍼널 데이터 계산
			const funnelData = questionList.map(
				(question: { id: string; question_text: string; question_order: number }, index: number) => {
					let reached = 0;
					let completed = 0;
					let totalTime = 0;

					responseData.forEach((response) => {
						if (response.responses) {
							try {
								const responses = response.responses as Array<{ choice_id?: string; answer?: string }>;
								// 해당 질문까지 도달한 응답 수
								if (responses.length > index) {
									reached++;
									// 해당 질문을 완료한 응답 수 (다음 질문으로 넘어간 경우)
									if (responses.length > index + 1 || response.completed_at) {
										completed++;
										if (response.completion_time_seconds) {
											totalTime += response.completion_time_seconds;
										}
									}
								}
							} catch (error) {
								// ignore parse error
							}
						}
					});

					const dropoff = reached > 0 ? Math.round(((reached - completed) / reached) * 100) : 0;
					const avgTime = completed > 0 ? Math.round(totalTime / completed) : 0;

					return {
						questionId: question.id,
						question: question.question_text,
						reached,
						completed,
						dropoff,
						avgTime,
						order: question.question_order,
					};
				}
			);

			return funnelData;
		} catch (error) {
			handleSupabaseError(error, 'getTestFunnelData');
			throw error;
		}
	},

	async getTestQualityMetrics(testId: string): Promise<{
		duplicateResponses: number;
		quickCompletions: number;
		reResponseRate: number;
		sameIPMultiple: number;
		avgResponseTime: number;
		completionRate: number;
	}> {
		try {
			const { data: responses, error } = await supabase
				.from('user_test_responses')
				.select('responses, created_at, completed_at, completion_time_seconds, ip_address')
				.eq('test_id', testId);

			if (error) throw error;

			const responseData = responses || [];
			const totalResponses = responseData.length;
			const completedResponses = responseData.filter((r: UserTestResponse) => r.completed_at);

			// 중복 응답 감지 (동일한 응답 패턴)
			let duplicateResponses = 0;
			const responsePatterns: Record<string, number> = {};
			responseData.forEach((response: { responses: unknown; completion_time_seconds: number | null }) => {
				if (response.responses) {
					try {
						const arr = response.responses as Array<{ choice_id?: string; answer?: string }>;
						const pattern = arr.map((r: { choice_id?: string; answer?: string }) => r.choice_id || r.answer).join(',');
						responsePatterns[pattern] = (responsePatterns[pattern] || 0) + 1;
					} catch (error) {
						// ignore parse error
					}
				}
			});

			Object.values(responsePatterns).forEach((count) => {
				if (count > 1) {
					duplicateResponses += count - 1;
				}
			});

			// 빠른 완료 감지 (30초 이내)
			const quickCompletions = completedResponses.filter(
				(r: UserTestResponse) => r.completion_time_seconds && r.completion_time_seconds < 30
			).length;

			// 재응답율 (동일 IP에서 여러 번 응답)
			const ipCounts: Record<string, number> = {};
			responseData.forEach((response: any) => {
				if (response.ip_address) {
					ipCounts[response.ip_address] = (ipCounts[response.ip_address] || 0) + 1;
				}
			});

			const sameIPMultiple = Object.values(ipCounts).filter((count) => count > 1).length;
			const reResponseRate = totalResponses > 0 ? Math.round((sameIPMultiple / totalResponses) * 100) : 0;

			// 평균 응답 시간
			const totalTime = completedResponses.reduce(
				(sum: number, r: UserTestResponse) => sum + (r.completion_time_seconds || 0),
				0
			);
			const avgResponseTime = completedResponses.length > 0 ? Math.round(totalTime / completedResponses.length) : 0;

			// 완료율
			const completionRate = totalResponses > 0 ? Math.round((completedResponses.length / totalResponses) * 100) : 0;

			const result = {
				duplicateResponses,
				quickCompletions,
				reResponseRate,
				sameIPMultiple,
				avgResponseTime,
				completionRate,
			};

			return result;
		} catch (error) {
			handleSupabaseError(error, 'getTestQualityMetrics');
			throw error;
		}
	},

	getCacheInfo() {
		return {
			size: 0,
			keys: [],
			entries: [],
		};
	},
};
