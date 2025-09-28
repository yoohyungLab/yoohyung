import { supabase } from '@repo/shared';
import type { Database } from '@repo/supabase';

// 마케팅 분석 관련 타입 정의
export interface MarketingFilters {
	from: string;
	to: string;
	source?: string;
	medium?: string;
	campaign?: string;
	device?: 'mobile' | 'desktop';
	region?: string;
	userType?: 'new' | 'returning';
}

// Database Functions에서 타입 가져오기
export type FunnelData = Database['public']['Functions']['get_marketing_funnel']['Returns'];
export type LandingPerformance = Database['public']['Functions']['get_landing_performance']['Returns'][0];

class MarketingService {
	// 퍼널 데이터 조회
	async getFunnelData(filters: MarketingFilters): Promise<FunnelData> {
		try {
			// 실제 user_test_responses 테이블에서 데이터 조회
			const { data: responsesData, error: responsesError } = await supabase
				.from('user_test_responses')
				.select('id, created_at, completed_at')
				.gte('created_at', filters.from)
				.lte('created_at', filters.to);

			if (responsesError) throw responsesError;

			const visits = responsesData?.length || 0;
			const testStarts = visits; // 모든 응답이 테스트 시작으로 간주
			const testCompletes = responsesData?.filter((r: { completed_at: string | null }) => r.completed_at).length || 0;
			const signUps = 0; // 실제 가입 데이터가 없으므로 0

			return {
				visits,
				test_starts: testStarts,
				test_completes: testCompletes,
				sign_ups: signUps,
				start_rate: visits > 0 ? 100 : 0,
				complete_rate: visits > 0 ? (testCompletes / visits) * 100 : 0,
				sign_up_rate: 0,
			};
		} catch (error) {
			console.error('퍼널 데이터 조회 실패:', error);
			// 데이터가 없을 때는 0으로 반환
			return {
				visits: 0,
				test_starts: 0,
				test_completes: 0,
				sign_ups: 0,
				start_rate: 0,
				complete_rate: 0,
				sign_up_rate: 0,
			};
		}
	}

	// 랜딩 페이지 성과 조회
	async getLandingPerformance(filters: MarketingFilters): Promise<LandingPerformance[]> {
		try {
			// 실제 user_test_responses와 tests 테이블에서 데이터 조회
			const { data: responsesData, error: responsesError } = await supabase
				.from('user_test_responses')
				.select(
					`
					id, 
					created_at, 
					test_id,
					tests!inner(title, slug)
				`
				)
				.gte('created_at', filters.from)
				.lte('created_at', filters.to);

			if (responsesError) throw responsesError;

			if (!responsesData || responsesData.length === 0) {
				return [];
			}

			// 실제 데이터 처리
			const testMap = new Map<
				string,
				{
					url: string;
					sessions: number;
				}
			>();

			responsesData.forEach((response: { test_id: string; tests?: { title: string; slug: string } }) => {
				const testId = response.test_id;
				const url = `/t/${response.tests?.slug || testId}`;

				if (!testMap.has(url)) {
					testMap.set(url, { url, sessions: 0 });
				}
				testMap.get(url)!.sessions++;
			});

			return Array.from(testMap.values()).map((test) => ({
				url: test.url,
				sessions: test.sessions,
				bounce_rate: 0,
				start_rate: 100,
				complete_rate: 100,
				avg_dwell_time: 0,
				conversion_value: 0,
			}));
		} catch (error) {
			console.error('랜딩 성과 데이터 조회 실패:', error);
			return [];
		}
	}

	// 디바이스 목록 조회
	async getDevices(): Promise<string[]> {
		try {
			// 실제 user_test_responses 테이블에서 device_type 데이터 조회
			const { data, error } = await supabase
				.from('user_test_responses')
				.select('device_type')
				.not('device_type', 'is', null);

			if (error) throw error;

			const devices = new Set<string>();
			data?.forEach((item: { device_type: string | null }) => {
				if (item.device_type) devices.add(item.device_type);
			});

			return Array.from(devices);
		} catch (error) {
			console.error('디바이스 조회 실패:', error);
			return [];
		}
	}

	// 지역 목록 조회
	async getRegions(): Promise<string[]> {
		try {
			// 실제 데이터가 없으므로 빈 배열 반환
			return [];
		} catch (error) {
			console.error('지역 조회 실패:', error);
			return [];
		}
	}
}

export const marketingService = new MarketingService();
