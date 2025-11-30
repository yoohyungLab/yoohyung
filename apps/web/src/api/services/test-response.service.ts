import { supabase } from '@pickid/supabase';
import type { UserTestResponse, UserTestResponseInsert } from '@pickid/supabase';

const USER_RESPONSE_QUERY = `
	*,
	test_results:result_id(*)
`;

export const testResponseService = {
	// 사용자 응답 저장 (세션/사용자 정보 포함)
	async saveUserResponse(
		params: Pick<UserTestResponseInsert, 'test_id' | 'result_id' | 'total_score' | 'gender'>
	): Promise<UserTestResponse> {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		const insertData: UserTestResponseInsert = {
			test_id: params.test_id,
			result_id: params.result_id,
			user_id: session?.user?.id || null,
			session_id: crypto.randomUUID(),
			total_score: params.total_score,
			gender: params.gender || null,
			completed_at: new Date().toISOString(),
			responses: {},
		};

		const { data, error } = await supabase.from('user_test_responses').insert(insertData).select().single();

		if (error) {
			throw new Error(`사용자 응답 저장 실패: ${error.message}`);
		}

		return data;
	},

	// 사용자 ID로 응답 조회
	async getUserResponseByUser(testId: string, userId: string): Promise<UserTestResponse | null> {
		const { data, error } = await supabase
			.from('user_test_responses')
			.select(USER_RESPONSE_QUERY)
			.eq('test_id', testId)
			.eq('user_id', userId)
			.order('completed_at', { ascending: false })
			.limit(1)
			.maybeSingle();

		if (error) {
			throw new Error(`사용자 응답 조회 실패: ${error.message}`);
		}

		return data;
	},

	// 세션 ID로 응답 조회
	async getUserResponseBySession(testId: string, sessionId: string): Promise<UserTestResponse | null> {
		const { data, error } = await supabase
			.from('user_test_responses')
			.select(USER_RESPONSE_QUERY)
			.eq('test_id', testId)
			.eq('session_id', sessionId)
			.order('completed_at', { ascending: false })
			.limit(1)
			.maybeSingle();

		if (error) {
			throw new Error(`세션 응답 조회 실패: ${error.message}`);
		}

		return data;
	},

	// 테스트 완료 결과 저장 (전체 프로세스)
	async saveUserTestResponse(
		result: Pick<UserTestResponseInsert, 'test_id' | 'result_id' | 'total_score' | 'gender' | 'completed_at'>
	): Promise<void> {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		const insertData: UserTestResponseInsert = {
			test_id: result.test_id,
			result_id: result.result_id,
			user_id: session?.user?.id || null,
			session_id: crypto.randomUUID(),
			total_score: result.total_score,
			gender: result.gender || null,
			completed_at: result.completed_at,
			responses: {},
		};

		const { error } = await supabase.from('user_test_responses').insert(insertData);

		if (error) {
			throw new Error(`테스트 응답 저장 실패: ${error.message}`);
		}
	},

	// 테스트 시작 횟수 증가
	async incrementTestStart(testId: string): Promise<void> {
		const { error } = await supabase.rpc('increment_test_start', {
			test_uuid: testId,
		});

		if (error) {
			throw new Error(`테스트 시작 횟수 증가 실패: ${error.message}`);
		}
	},

	// 테스트 완료 횟수 증가
	async incrementTestResponse(testId: string): Promise<void> {
		const { error } = await supabase.rpc('increment_test_response', {
			test_uuid: testId,
		});

		if (error) {
			throw new Error(`테스트 완료 횟수 증가 실패: ${error.message}`);
		}
	},

	// 밸런스 게임 투표 일괄 제출
	async submitBalanceGameVotes(votes: Array<{ choice_id: string }>): Promise<void> {
		const { error } = await supabase.rpc('submit_balance_game_votes' as any, {
			p_votes: votes,
		});

		if (error) {
			console.error('Error submitting balance game votes:', error);
			throw new Error(`밸런스 게임 투표 제출 실패: ${error.message}`);
		}
	},
};
