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
