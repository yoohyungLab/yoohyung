const isVite = typeof import.meta !== 'undefined' && (import.meta as any).env !== undefined;

export function getSupabaseConfig() {
	if (isVite) {
		const env = (import.meta as any).env;
		return {
			url: env?.VITE_SUPABASE_URL || '',
			anonKey: env?.VITE_SUPABASE_ANON_KEY || '',
			serviceRoleKey: env?.VITE_SUPABASE_SERVICE_ROLE_KEY || '',
		};
	}

	if (typeof process !== 'undefined' && process.env) {
		return {
			url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
			anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
			serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
		};
	}

	throw new Error('지원하지 않는 환경입니다.');
}
