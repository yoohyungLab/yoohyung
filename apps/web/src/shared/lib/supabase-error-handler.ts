
/**
 * Supabase 에러를 로깅하고 throw하는 공통 핸들러
 * @param error - 발생한 에러
 * @param context - 에러 발생 컨텍스트 (함수명 등)
 */
export function handleSupabaseError(error: unknown, context: string): never {
	console.error(`Error in ${context}:`, error);
	throw error;
}

/**
 * Not Found 에러 여부 확인 (PGRST116)
 * @param error - 확인할 에러
 */
export function isNotFoundError(error: unknown): boolean {
	return (error as { code?: string })?.code === 'PGRST116';
}
