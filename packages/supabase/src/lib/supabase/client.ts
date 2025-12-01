import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';
import { getSupabaseConfig } from './config';

const { url, anonKey } = getSupabaseConfig();

if (!url || !anonKey) {
	throw new Error('Supabase URL과 Anon Key가 설정되지 않았습니다.');
}

export const supabase = createClient<Database>(url, anonKey, {
	auth: {
		storageKey: 'pickid-auth',
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
	},
});

export type SupabaseClient = typeof supabase;
