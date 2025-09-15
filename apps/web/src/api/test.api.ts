import { supabase } from '@repo/shared';

// 공통 타입 정의
export interface Profile {
    id: string;
    email?: string;
    name: string;
    avatar_url?: string;
    provider: 'kakao' | 'email' | 'google';
    kakao_id?: string;
    created_at: string;
    updated_at: string;
}

export interface TestResult {
    id: string;
    user_id: string;
    test_type: string;
    result_data: Record<string, unknown>;
    score: number;
    gender: 'male' | 'female';
    created_at: string;
}

export interface TestResultData {
    id?: string;
    gender: 'male' | 'female';
    result: 'egen-male' | 'egen-female' | 'teto-male' | 'teto-female' | 'mixed';
    score: number;
    answers: number[];
    created_at?: string;
}

// 공통 API 함수들
export const testApi = {
    // 공개된 모든 테스트 조회
    async getPublishedTests() {
        const { data, error } = await supabase
            .from('tests')
            .select(
                `
                *,
                questions:questions(
                    *,
                    question_options:question_options(*)
                ),
                test_results:test_results(*)
            `
            )
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // 특정 테스트 조회
    async getTestBySlug(slug: string) {
        const { data, error } = await supabase
            .from('tests')
            .select(
                `
                *,
                questions:questions(
                    *,
                    question_options:question_options(*)
                ),
                test_results:test_results(*)
            `
            )
            .eq('slug', slug)
            .eq('is_published', true)
            .single();

        if (error) throw error;
        return data;
    },

    // 사용자 응답 저장
    async saveUserResponse(
        testId: string,
        sessionId: string,
        answers: Record<string, unknown>,
        resultId?: string,
        score?: number,
        metadata?: Record<string, unknown>
    ) {
        const { data, error } = await supabase
            .from('user_responses')
            .insert([
                {
                    test_id: testId,
                    session_id: sessionId,
                    answers,
                    result_id: resultId,
                    score,
                    metadata,
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // 세션별 응답 조회
    async getUserResponseBySession(sessionId: string, testId: string) {
        const { data, error } = await supabase
            .from('user_responses')
            .select(
                `
                *,
                test_results:result_id(*)
            `
            )
            .eq('session_id', sessionId)
            .eq('test_id', testId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116는 데이터가 없을 때
        return data;
    },
};

// 결과 저장 함수
export const saveTestResult = async (data: Omit<TestResultData, 'id' | 'created_at'>) => {
    try {
        const { data: result, error } = await supabase.from('test_results').insert([data]).select().single();

        if (error) {
            console.error('Error saving test result:', error);
            throw error;
        }

        return result;
    } catch (error) {
        console.error('Failed to save test result:', error);
        throw error;
    }
};

// 결과 조회 함수
export const getTestResults = async () => {
    try {
        const { data, error } = await supabase.from('test_results').select('*').order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching test results:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch test results:', error);
        throw error;
    }
};
