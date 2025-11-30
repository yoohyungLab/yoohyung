import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';
import { getSupabaseConfig } from './lib/supabase-config';

const { url: supabaseUrl, anonKey: supabaseAnonKey, serviceRoleKey: supabaseServiceRoleKey } = getSupabaseConfig();

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
	auth: {
		storageKey: 'pickid-auth',
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
	},
});

export const createServerClient = () => {
	return createClient<Database>(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
};

export const createAdminClient = () => {
	return createClient<Database>(supabaseUrl, supabaseServiceRoleKey || '', {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
};

export type SupabaseClient = typeof supabase;

export { supabase as default };
