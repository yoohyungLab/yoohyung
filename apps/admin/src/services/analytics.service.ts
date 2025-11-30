import { supabase } from '@pickid/supabase';
import type { DashboardOverviewStats, Test, UserTestResponse } from '@pickid/supabase';
import type {
	GetTestDetailedStatsReturn,
	AdminGetTestBasicStatsReturn,
	AdminGetTestAnalyticsDataReturn,
} from '@/types/analytics.types';

export const analyticsService = {
	async getTestDetailedStats(testId: string): Promise<GetTestDetailedStatsReturn> {
		const { data: testData, error: testError } = await supabase
			.from('tests')
			.select('id, title, response_count, start_count, created_at')
			.eq('id', testId)
			.single();

		if (testError) {
			throw new Error(`테스트 정보 조회 실패: ${testError.message}`);
		}

		const { data: responses, error: responsesError } = await supabase
			.from('user_test_responses')
			.select('id, created_at, completed_at, total_score, completion_time_seconds')
			.eq('test_id', testId);

		if (responsesError) {
			throw new Error(`응답 데이터 조회 실패: ${responsesError.message}`);
		}

		const responseData = responses || [];
		const totalResponses = responseData.length;
		const completedResponses = responseData.filter((r) => r.completed_at).length;
		const completionRate = totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;
		const avgScore =
			responseData.length > 0
				? responseData.reduce((sum: number, r: { total_score: number | null }) => sum + (r.total_score || 0), 0) /
				  responseData.length
				: 0;
		const avgTime =
			responseData.length > 0
				? responseData.reduce(
						(sum: number, r: { completion_time_seconds: number | null }) => sum + (r.completion_time_seconds || 0),
						0
				  ) / responseData.length
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
	},

	async getAllTestsForAnalytics(): Promise<(Test & { avg_completion_time?: number })[]> {
		const { data, error } = await supabase
			.from('tests')
			.select('id, title, slug, status, type, response_count, start_count, created_at')
			.order('created_at', { ascending: false });

		if (error) {
			throw new Error(`테스트 목록 조회 실패: ${error.message}`);
		}

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
	},

	async getDashboardOverviewStats(): Promise<DashboardOverviewStats> {
		// 테스트 통계 조회
		const { data: tests, error: testsError } = await supabase.from('tests').select('id, status');

		if (testsError) {
			throw new Error(`테스트 통계 조회 실패: ${testsError.message}`);
		}

		const { data: responses, error: responsesError } = await supabase
			.from('user_test_responses')
			.select('id, completed_at, completion_time_seconds');

		if (responsesError) {
			throw new Error(`응답 통계 조회 실패: ${responsesError.message}`);
		}

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
	},

	async getTestBasicStats(testId: string): Promise<AdminGetTestBasicStatsReturn> {
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
				? responseData.reduce(
						(sum: number, r: { completion_time_seconds: number | null }) => sum + (r.completion_time_seconds || 0),
						0
				  ) / responseData.length
				: 0;

		const avgScore =
			responseData.length > 0
				? responseData.reduce((sum: number, r: { total_score: number | null }) => sum + (r.total_score || 0), 0) /
				  responseData.length
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
	},

	async getTestAnalyticsData(testId: string, days: number = 30): Promise<AdminGetTestAnalyticsDataReturn> {
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(endDate.getDate() - days);

		// 테스트 기본 정보 조회
		const { data: testData, error: testError } = await supabase
			.from('tests')
			.select('id, title, description, created_at, response_count, start_count')
			.eq('id', testId)
			.single();

		if (testError) {
			throw new Error(`테스트 정보 조회 실패: ${testError.message}`);
		}

		const { data: responses, error: responsesError } = await supabase
			.from('user_test_responses')
			.select('id, created_at, completed_at, total_score, completion_time_seconds')
			.eq('test_id', testId)
			.gte('created_at', startDate.toISOString())
			.lte('created_at', endDate.toISOString());

		if (responsesError) {
			throw new Error(`응답 데이터 조회 실패: ${responsesError.message}`);
		}

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
			popular_results: [], // 임시로 빈 배열 반환
		};
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
		// 테스트 질문들 조회
		const { data: questions, error: questionsError } = await supabase
			.from('test_questions')
			.select('id, question_text, question_order')
			.eq('test_id', testId)
			.order('question_order', { ascending: true });

		if (questionsError) {
			throw new Error(`질문 목록 조회 실패: ${questionsError.message}`);
		}

		const { data: responses, error: responsesError } = await supabase
			.from('user_test_responses')
			.select('responses, created_at, completed_at, completion_time_seconds')
			.eq('test_id', testId);

		if (responsesError) {
			throw new Error(`응답 데이터 조회 실패: ${responsesError.message}`);
		}

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
	},
};
