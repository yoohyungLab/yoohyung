import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

// 환경 변수 가져오기 (Next.js 또는 Vite)
// Vite에서는 vite.config.ts의 define을 통해 process.env로 접근 가능
// Next.js에서는 process.env 직접 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// 개발 환경에서 환경 변수 로드 확인 (디버깅용)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
	console.log('[Supabase] 환경 변수 로드 상태:', {
		hasUrl: !!supabaseUrl,
		hasKey: !!supabaseAnonKey,
		urlLength: supabaseUrl.length,
		keyLength: supabaseAnonKey.length,
		NODE_ENV: process.env.NODE_ENV,
	});
}

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
	const errorMsg = `Supabase URL과 Anon Key가 설정되지 않았습니다.
URL: ${supabaseUrl ? '설정됨' : '없음'}
Key: ${supabaseAnonKey ? '설정됨' : '없음'}
Vite 환경 변수는 VITE_ 접두사가 필요합니다.`;
	console.error('[Supabase]', errorMsg);
	throw new Error(errorMsg);
}

/**
 * 클라이언트용 Supabase 클라이언트
 * - 브라우저에서 사용
 * - 인증 세션 자동 관리 (localStorage)
 * - Supabase가 자동으로 토큰 갱신 처리
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
	auth: {
		storageKey: 'pickid-auth',
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
	},
});

/**
 * 서버용 Supabase 클라이언트
 * - SSR/Server Component에서 사용
 * - 세션 저장 안함
 */
export const createServerClient = () => {
	return createClient<Database>(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
};

/**
 * Admin용 Supabase 클라이언트
 * - Service Role Key 사용
 * - RLS 우회 가능
 * - 서버에서만 사용 (절대 클라이언트에 노출 금지)
 */
export const createAdminClient = () => {
	if (!supabaseServiceRoleKey) {
		throw new Error('SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다.');
	}

	return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
};

export type SupabaseClient = typeof supabase;

export * from './types';
export type { User } from '@supabase/supabase-js';
export type AuthUser = import('@supabase/supabase-js').User;
export { supabase as default };
