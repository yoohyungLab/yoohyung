import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// 환경 변수가 없으면 에러를 던지도록 수정
if (!supabaseUrl || !supabaseAnonKey) {
	console.error(
		'Supabase environment variables not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
	);
	throw new Error('Supabase configuration is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storageKey: 'pickid-admin-auth', // 고유한 storage key
		persistSession: true,
	},
});

export type SupabaseClient = typeof supabase;
