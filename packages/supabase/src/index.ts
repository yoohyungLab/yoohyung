import { createClient } from '@supabase/supabase-js';

// 환경 변수 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// 환경 변수 검증
if (!supabaseUrl) {
	throw new Error('NEXT_PUBLIC_SUPABASE_URL 환경 변수가 설정되지 않았습니다.');
}
if (!supabaseAnonKey) {
	throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY 환경 변수가 설정되지 않았습니다.');
}

/**
 * 기본 Supabase 클라이언트
 * - 클라이언트 사이드에서 사용 (인증 포함)
 * - 세션 자동 관리
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storageKey: 'pickid-auth',
		persistSession: true,
	},
});

/**
 * 서버 사이드용 Supabase 클라이언트
 * - SSR/API에서 사용
 * - 세션 관리 없음 (정적 데이터 조회용)
 */
export const createServerClient = () => {
	return createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false,
		},
	});
};

/**
 * Admin용 Supabase 클라이언트
 * - Service Role Key 사용
 * - auth.admin API 접근 가능
 * - 서버 사이드에서만 사용
 */
export const createAdminClient = () => {
	if (!supabaseServiceRoleKey) {
		throw new Error('SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다.');
	}

	return createClient(supabaseUrl, supabaseServiceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
};

// 타입 내보내기
export type SupabaseClient = typeof supabase;

// 타입들 re-export
export * from './types';

// Supabase 타입들 re-export
export type { User } from '@supabase/supabase-js';

// auth.users의 User 타입을 AuthUser로 별칭
export type AuthUser = import('@supabase/supabase-js').User;

// 기존 호환성을 위한 별칭
export { supabase as default };
