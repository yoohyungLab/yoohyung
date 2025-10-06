import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// 환경 변수 검증
if (!supabaseUrl) {
	throw new Error('NEXT_PUBLIC_SUPABASE_URL 환경 변수가 설정되지 않았습니다.');
}
if (!supabaseAnonKey) {
	throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY 환경 변수가 설정되지 않았습니다.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storageKey: 'pickid-admin-auth', // 고유한 storage key
		persistSession: true,
	},
});

export const createMiddlewareClient = (req: NextRequest, res: NextResponse) => {
	return createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return req.cookies.get(name)?.value;
			},
			set(name: string, value: string, options: any) {
				res.cookies.set({ name, value, ...options });
			},
			remove(name: string, options: any) {
				res.cookies.set({ name, value: '', ...options });
			},
		},
	});
};

export type SupabaseClient = typeof supabase;
