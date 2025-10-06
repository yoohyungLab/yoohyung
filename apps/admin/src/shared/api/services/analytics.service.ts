import { supabase } from '@repo/shared';
import type {
	Test,
	Database,
	TestDetailedStats,
	DashboardOverviewStats,
	TestBasicStats,
	TestAnalyticsData,
	ResponseChartData,
	UserResponseStats,
	ExportData,
} from '@repo/supabase';

// Supabase에서 타입 가져오기
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];

// React Query가 캐싱을 담당하므로 서비스 레벨 캐싱 제거
// 필요시 React Query의 staleTime과 gcTime으로 제어

export const analyticsService = {
	/**
	 * 테스트별 상세 통계 조회
	 */
	async getTestDetailedStats(testId: string): Promise<TestDetailedStats> {
		try {
			const { data, error } = await supabase.rpc('get_test_detailed_stats', {
				test_id: testId,
			});

			if (error) {
				console.error('Error fetching test detailed stats:', error);
				throw new Error(`테스트 상세 통계 조회 실패: ${error.message}`);
			}

			return data as TestDetailedStats;
		} catch (error) {
			console.error('Error in getTestDetailedStats:', error);
			throw error;
		}
	},

	/**
	 * 응답 차트 데이터 조회
	 */
	async getResponsesChartData(testId?: string, daysBack: number = 30): Promise<ResponseChartData> {
		try {
			const { data, error } = await supabase.rpc('get_responses_chart_data', {
				test_id: testId || '',
				days: daysBack,
			});

			if (error) {
				console.error('Error fetching responses chart data:', error);
				throw new Error(`응답 차트 데이터 조회 실패: ${error.message}`);
			}

			// 차트 데이터 포맷팅
			const chartData = data as Array<{
				date: string;
				responses: number;
			}>;

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
			console.error('Error in getResponsesChartData:', error);
			throw error;
		}
	},

	/**
	 * 사용자 응답 통계 조회
	 */
	async getUserResponseStats(testId: string): Promise<UserResponseStats> {
		try {
			const { data, error } = await supabase.rpc('get_user_responses_stats', {
				test_id: testId,
			});

			if (error) {
				console.error('Error fetching user response stats:', error);
				throw new Error(`사용자 응답 통계 조회 실패: ${error.message}`);
			}

			return data as UserResponseStats;
		} catch (error) {
			console.error('Error in getUserResponseStats:', error);
			throw error;
		}
	},

	/**
	 * 사용자 응답 데이터 내보내기
	 */
	async exportUserResponses(testId: string, limitCount: number = 1000, offsetCount: number = 0): Promise<ExportData[]> {
		try {
			const { data, error } = await supabase.rpc('export_user_responses', {
				test_id: testId,
				limit_count: limitCount,
				offset_count: offsetCount,
			});

			if (error) {
				console.error('Error exporting user responses:', error);
				throw new Error(`사용자 응답 내보내기 실패: ${error.message}`);
			}

			return data as ExportData[];
		} catch (error) {
			console.error('Error in exportUserResponses:', error);
			throw error;
		}
	},

	/**
	 * 모든 테스트 목록 조회 (분석용)
	 */
	async getAllTestsForAnalytics(): Promise<(Test & { avg_completion_time?: number })[]> {
		try {
			const { data, error } = await supabase
				.from('tests')
				.select('id, title, slug, status, type, response_count, view_count, created_at')
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Error fetching tests for analytics:', error);
				// 에러 발생 시 빈 배열 반환 (400 에러 대신 빈 목록 표시)
				return [];
			}

			const tests = data || [];

			// 각 테스트의 평균 소요시간 계산
			const testsWithAvgTime = await Promise.all(
				tests.map(async (test: Test) => {
					try {
						// 해당 테스트의 완료된 응답들의 소요시간 조회
						const { data: responses, error: responseError } = await supabase
							.from('user_test_responses')
							.select('completion_time_seconds')
							.eq('test_id', test.id)
							.not('completion_time_seconds', 'is', null);

						if (responseError) {
							console.error(`Error fetching completion times for test ${test.id}:`, responseError);
							return { ...test, avg_completion_time: 0 };
						}

						const completionTimes = responses || [];
						const avgTime =
							completionTimes.length > 0
								? Math.round(
										completionTimes.reduce(
											(sum: number, r: Tables<'user_test_responses'>['Row']) => sum + (r.completion_time_seconds || 0),
											0
										) / completionTimes.length
								  )
								: 0;

						return { ...test, avg_completion_time: avgTime };
					} catch (error) {
						console.error(`Error calculating avg time for test ${test.id}:`, error);
						return { ...test, avg_completion_time: 0 };
					}
				})
			);

			return testsWithAvgTime;
		} catch (error) {
			console.error('Error in getAllTestsForAnalytics:', error);
			// 에러 발생 시 빈 배열 반환
			return [];
		}
	},

	/**
	 * 카테고리별 통계 조회
	 */
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

			if (categoryError) {
				console.error('Error fetching categories:', categoryError);
				throw new Error(`카테고리 조회 실패: ${categoryError.message}`);
			}

			// 각 카테고리별 통계 계산
			const categoryStats = await Promise.all(
				(categories || []).map(async (category: Tables<'categories'>['Row']) => {
					// 해당 카테고리의 테스트들 조회
					const { data: tests, error: testError } = await supabase
						.from('tests')
						.select('id, response_count, view_count')
						.contains('category_ids', [category.id])
						.eq('status', 'published');

					if (testError) {
						console.error(`Error fetching tests for category ${category.id}:`, testError);
						return {
							category_id: category.id,
							category_name: category.name,
							test_count: 0,
							total_responses: 0,
							average_completion_rate: 0,
						};
					}

					const testList = tests || [];
					const totalResponses = testList.reduce(
						(sum: number, test: Tables<'tests'>['Row']) => sum + (test.response_count || 0),
						0
					);
					const totalViews = testList.reduce(
						(sum: number, test: Tables<'tests'>['Row']) => sum + (test.view_count || 0),
						0
					);
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
			console.error('Error in getCategoryStats:', error);
			throw error;
		}
	},

	/**
	 * 대시보드 전체 통계 조회 (직접 쿼리로 구현)
	 */
	async getDashboardOverviewStats(): Promise<DashboardOverviewStats> {
		try {
			// 테스트 통계 조회
			const { data: tests, error: testsError } = await supabase.from('tests').select('id, status');

			if (testsError) {
				throw new Error(`테스트 데이터 조회 실패: ${testsError.message}`);
			}

			// 응답 통계 조회
			const { data: responses, error: responsesError } = await supabase
				.from('user_test_responses')
				.select('id, completed_at, completion_time_seconds');

			if (responsesError) {
				throw new Error(`응답 데이터 조회 실패: ${responsesError.message}`);
			}

			const testData = tests || [];
			const responseData = responses || [];

			// 테스트 상태별 카운트
			const total = testData.length;
			const published = testData.filter((t: Tables<'tests'>['Row']) => t.status === 'published').length;
			const draft = testData.filter((t: Tables<'tests'>['Row']) => t.status === 'draft').length;
			const scheduled = testData.filter((t: Tables<'tests'>['Row']) => t.status === 'scheduled').length;

			// 응답 통계
			const totalResponses = responseData.length;
			const totalCompletions = responseData.filter((r: Tables<'user_test_responses'>['Row']) => r.completed_at).length;
			const completionRate = totalResponses > 0 ? (totalCompletions / totalResponses) * 100 : 0;

			const completedResponses = responseData.filter((r: Tables<'user_test_responses'>['Row']) => r.completed_at);
			const avgCompletionTime =
				completedResponses.length > 0
					? completedResponses.reduce(
							(sum: number, r: Tables<'user_test_responses'>['Row']) => sum + (r.completion_time_seconds || 0),
							0
					  ) / completedResponses.length
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
			console.error('Error in getDashboardOverviewStats:', error);
			// 에러 발생 시 기본값 반환
			return {
				total: 0,
				published: 0,
				draft: 0,
				scheduled: 0,
				totalResponses: 0,
				totalCompletions: 0,
				completionRate: 0,
				avgCompletionTime: 0,
				anomalies: 0,
			};
		}
	},

	/**
	 * 테스트별 기본 통계 조회 (서버에서 처리)
	 */
	async getTestBasicStats(testId: string): Promise<TestBasicStats> {
		try {
			// 서버의 RPC 함수 호출
			const { data, error } = await supabase.rpc('get_test_basic_stats', {
				test_id: testId,
			});

			if (error) {
				console.error('Error fetching test basic stats:', error);
				throw new Error(`테스트 기본 통계 조회 실패: ${error.message}`);
			}

			const result: TestBasicStats = data || {
				responses: 0,
				completions: 0,
				completionRate: 0,
				avgTime: 0,
				avgScore: 0,
				deviceBreakdown: {
					mobile: 0,
					desktop: 0,
					tablet: 0,
				},
			};

			return result;
		} catch (error) {
			console.error('Error in getTestBasicStats:', error);
			// 에러 발생 시 기본값 반환
			return {
				responses: 0,
				completions: 0,
				completionRate: 0,
				avgTime: 0,
				avgScore: 0,
				deviceBreakdown: {
					mobile: 0,
					desktop: 0,
					tablet: 0,
				},
			};
		}
	},

	/**
	 * 테스트별 상세 분석 데이터 조회 (RPC 함수 사용)
	 */
	async getTestAnalyticsData(testId: string, days: number = 30): Promise<TestAnalyticsData> {
		try {
			const { data, error } = await supabase.rpc('get_test_analytics_data', {
				test_id: testId,
				days: days,
			});

			if (error) {
				console.error('Error fetching test analytics data:', error);
				throw new Error(`테스트 분석 데이터 조회 실패: ${error.message}`);
			}

			return data as TestAnalyticsData;
		} catch (error) {
			console.error('Error in getTestAnalyticsData:', error);
			throw error;
		}
	},

	/**
	 * 이상 패턴 감지 (서버에서 처리하므로 클라이언트에서는 제거)
	 * 이 함수는 서버의 RPC 함수에서 처리됩니다.
	 */

	/**
	 * 캐시 무효화 (React Query가 담당하므로 빈 함수)
	 */
	invalidateCache(pattern?: string) {
		// React Query가 캐싱을 담당하므로 서비스 레벨에서는 무효화하지 않음
		// 필요시 React Query의 invalidateQueries 사용
		console.log('Cache invalidation delegated to React Query', pattern);
	},

	/**
	 * 테스트별 시계열 트렌드 데이터 조회
	 */
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

			if (error) {
				throw new Error(`트렌드 데이터 조회 실패: ${error.message}`);
			}

			// 날짜별로 그룹화
			const dailyData: Record<string, { responses: number; completions: number }> = {};
			const responseData = responses || [];

			responseData.forEach((response: Tables<'user_test_responses'>['Row']) => {
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
			console.error('Error in getTestTrendsData:', error);
			return {
				labels: [],
				datasets: {
					responses: [],
					completions: [],
					completionRates: [],
				},
			};
		}
	},

	/**
	 * 테스트별 세그먼트 분석 데이터 조회
	 */
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

			if (error) {
				throw new Error(`세그먼트 데이터 조회 실패: ${error.message}`);
			}

			const responseData = responses || [];
			const totalResponses = responseData.length;

			// 디바이스별 세그먼트
			const deviceMap: Record<string, { count: number; completions: number; totalTime: number }> = {};
			responseData.forEach((response: Tables<'user_test_responses'>['Row']) => {
				const device = response.device_type || 'unknown';
				if (!deviceMap[device]) {
					deviceMap[device] = { count: 0, completions: 0, totalTime: 0 };
				}
				deviceMap[device].count++;
				if (response.completed_at) {
					deviceMap[device].completions++;
					deviceMap[device].totalTime += response.completion_time_seconds || 0;
				}
			});

			const deviceSegments = Object.entries(deviceMap).map(([device, data]) => ({
				device: device.charAt(0).toUpperCase() + device.slice(1),
				count: data.count,
				percentage: totalResponses > 0 ? Math.round((data.count / totalResponses) * 100) : 0,
				avgCompletionTime: data.completions > 0 ? Math.round(data.totalTime / data.completions) : 0,
				completionRate: data.count > 0 ? Math.round((data.completions / data.count) * 100) : 0,
			}));

			// 시간대별 세그먼트
			const timeMap: Record<number, { count: number; totalTime: number }> = {};
			responseData.forEach((response: Tables<'user_test_responses'>['Row']) => {
				const hour = new Date(response.created_at || '').getHours();
				if (!timeMap[hour]) {
					timeMap[hour] = { count: 0, totalTime: 0 };
				}
				timeMap[hour].count++;
				if (response.completed_at) {
					timeMap[hour].totalTime += response.completion_time_seconds || 0;
				}
			});

			const timeSegments = Object.entries(timeMap).map(([hour, data]) => ({
				hour: parseInt(hour),
				count: data.count,
				percentage: totalResponses > 0 ? Math.round((data.count / totalResponses) * 100) : 0,
				avgCompletionTime: data.count > 0 ? Math.round(data.totalTime / data.count) : 0,
			}));

			// 요일별 세그먼트
			const dayMap: Record<string, { count: number; totalTime: number }> = {};
			const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
			responseData.forEach((response: Tables<'user_test_responses'>['Row']) => {
				const day = dayNames[new Date(response.created_at || '').getDay()];
				if (!dayMap[day]) {
					dayMap[day] = { count: 0, totalTime: 0 };
				}
				dayMap[day].count++;
				if (response.completed_at) {
					dayMap[day].totalTime += response.completion_time_seconds || 0;
				}
			});

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
			console.error('Error in getTestSegmentsData:', error);
			return {
				deviceSegments: [],
				timeSegments: [],
				daySegments: [],
			};
		}
	},

	/**
	 * 테스트별 질문 퍼널 분석 데이터 조회
	 */
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

			if (questionsError) {
				throw new Error(`질문 데이터 조회 실패: ${questionsError.message}`);
			}

			// 응답 데이터 조회
			const { data: responses, error: responsesError } = await supabase
				.from('user_test_responses')
				.select('responses_json, created_at, completed_at, completion_time_seconds')
				.eq('test_id', testId);

			if (responsesError) {
				throw new Error(`응답 데이터 조회 실패: ${responsesError.message}`);
			}

			const questionList = questions || [];
			const responseData = responses || [];

			// 각 질문별 퍼널 데이터 계산
			const funnelData = questionList.map((question: Tables<'test_questions'>['Row'], index: number) => {
				let reached = 0;
				let completed = 0;
				let totalTime = 0;

				responseData.forEach((response: Tables<'user_test_responses'>['Row']) => {
					if (response.responses_json) {
						try {
							const responses = JSON.parse(response.responses_json);
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
							console.error('Error parsing responses JSON:', error);
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
			});

			return funnelData;
		} catch (error) {
			console.error('Error in getTestFunnelData:', error);
			return [];
		}
	},

	/**
	 * 테스트별 품질 지표 데이터 조회
	 */
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
				.select('responses_json, created_at, completed_at, completion_time_seconds, ip_address')
				.eq('test_id', testId);

			if (error) {
				throw new Error(`품질 지표 데이터 조회 실패: ${error.message}`);
			}

			const responseData = responses || [];
			const totalResponses = responseData.length;
			const completedResponses = responseData.filter((r: Tables<'user_test_responses'>['Row']) => r.completed_at);

			// 중복 응답 감지 (동일한 응답 패턴)
			let duplicateResponses = 0;
			const responsePatterns: Record<string, number> = {};
			responseData.forEach((response: any) => {
				if (response.responses_json) {
					try {
						const responses = JSON.parse(response.responses_json);
						const pattern = responses
							.map((r: { choice_id?: string; answer?: string }) => r.choice_id || r.answer)
							.join(',');
						responsePatterns[pattern] = (responsePatterns[pattern] || 0) + 1;
					} catch (error) {
						console.error('Error parsing responses JSON:', error);
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
				(r: Tables<'user_test_responses'>['Row']) => r.completion_time_seconds && r.completion_time_seconds < 30
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
				(sum: number, r: Tables<'user_test_responses'>['Row']) => sum + (r.completion_time_seconds || 0),
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
			console.error('Error in getTestQualityMetrics:', error);
			return {
				duplicateResponses: 0,
				quickCompletions: 0,
				reResponseRate: 0,
				sameIPMultiple: 0,
				avgResponseTime: 0,
				completionRate: 0,
			};
		}
	},

	/**
	 * 캐시 상태 조회 (React Query가 담당하므로 빈 함수)
	 */
	getCacheInfo() {
		// React Query가 캐싱을 담당하므로 서비스 레벨에서는 상태 조회 불가
		return {
			size: 0,
			keys: [],
			entries: [],
		};
	},
};
