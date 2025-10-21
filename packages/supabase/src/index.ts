import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

// 환경 변수 가져오기 (Next.js 또는 Vite)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Supabase URL과 Anon Key가 설정되지 않았습니다.');
}

/**
 * 클라이언트용 Supabase 클라이언트
 * - 브라우저에서 사용
 * - 인증 세션 자동 관리
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
