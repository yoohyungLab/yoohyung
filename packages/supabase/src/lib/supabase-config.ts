export const getSupabaseConfig = () => {
	const isVite = typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined';
	const isNext = typeof process !== 'undefined' && typeof process.env !== 'undefined';

	if (isVite) {
		return {
			url: import.meta.env.VITE_SUPABASE_URL || '',
			anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
			serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '',
		};
	}

	if (isNext) {
		return {
			url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
			anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
			serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
		};
	}

	throw new Error('지원하지 않는 환경입니다.');
};
