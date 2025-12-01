import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';
import { getSupabaseConfig } from './config';

const { url, serviceRoleKey } = getSupabaseConfig();

export function createAdminClient() {
	if (!url) {
		throw new Error('Supabase URL이 설정되지 않았습니다.');
	}

	if (!serviceRoleKey) {
		throw new Error('Service Role Key가 설정되지 않았습니다. ' + '이 클라이언트는 서버 환경에서만 사용할 수 있습니다.');
	}

	return createClient<Database>(url, serviceRoleKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
}
