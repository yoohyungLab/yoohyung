// ============================================
// lib/supabase/server.ts
// 서버 사이드 렌더링용 (Next.js)
// ============================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';
import { getSupabaseConfig } from './config';

const { url, anonKey } = getSupabaseConfig();

/**
 * 서버 컴포넌트용 Supabase 클라이언트
 * - 세션 저장하지 않음
 * - 요청마다 새 인스턴스 생성
 */
export function createServerClient() {
	if (!url || !anonKey) {
		throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
	}

	return createClient<Database>(url, anonKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
}

