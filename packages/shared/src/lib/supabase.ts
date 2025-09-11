import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase 설정 가져오기
const getSupabaseConfig = () => {
    // Next.js 환경 변수 (web 앱용)
    if (typeof window !== 'undefined') {
        return {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        };
    }

    // Vite 환경 변수 (admin 앱용)
    if (typeof import.meta !== 'undefined') {
        const viteEnv = (import.meta as any).env;
        return {
            url: viteEnv?.VITE_SUPABASE_URL || '',
            anonKey: viteEnv?.VITE_SUPABASE_ANON_KEY || '',
        };
    }

    // Node.js 환경 변수 (서버사이드용)
    return {
        url: process.env.SUPABASE_URL || '',
        anonKey: process.env.SUPABASE_ANON_KEY || '',
    };
};

const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseConfig();

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
    const envType = typeof window !== 'undefined' ? 'NEXT_PUBLIC_' : 'VITE_';
    console.warn(`⚠️ Supabase environment variables not found. Please set ${envType}SUPABASE_URL and ${envType}SUPABASE_ANON_KEY`);
}

// 환경 변수가 없을 때 더미 클라이언트 생성
const createDummyClient = () => {
    return {
        auth: {
            signInWithOAuth: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
            signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
            signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
            signOut: () => Promise.resolve({ error: null }),
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            updateUser: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        },
        from: () => ({
            select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
            insert: () => ({
                select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
            }),
            update: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
            delete: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
        }),
    } as any;
};

// URL 유효성 검증 및 클라이언트 생성
let supabaseClient;
try {
    if (supabaseUrl && supabaseAnonKey) {
        new URL(supabaseUrl);
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
            },
        });
    } else {
        supabaseClient = createDummyClient();
    }
} catch {
    console.error(`Invalid Supabase URL: ${supabaseUrl}`);
    supabaseClient = createDummyClient();
}

export const supabase = supabaseClient;

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
    result_data: any;
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
    async saveUserResponse(testId: string, sessionId: string, answers: any, resultId?: string, score?: number, metadata?: any) {
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

// OAuth 로그인 함수들
export const signInWithKakao = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('카카오 로그인 실패:', error);
        return { data: null, error };
    }
};

export const signInWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('구글 로그인 실패:', error);
        return { data: null, error };
    }
};
