/**
 * Supabase 에러 핸들러 유틸리티
 */

/**
 * Supabase 에러를 로깅하고 throw하는 공통 핸들러
 * @param error - 발생한 에러
 * @param context - 에러 발생 컨텍스트 (함수명 등)
 */
export function handleSupabaseError(error: unknown, context: string): never {
	let message: string;

	if (error instanceof Error) {
		message = error.message;
	} else if (typeof error === 'object' && error !== null) {
		// Supabase 에러 객체 처리
		message = JSON.stringify(error, null, 2);
	} else {
		message = String(error);
	}

	console.error(`${context} error:`, error);
	throw new Error(`${context}: ${message}`);
}

/**
 * RPC 결과 검증 유틸리티
 * @param result - RPC 결과
 * @param errorMessage - 실패 시 표시할 에러 메시지
 */
export function validateRpcResult(result: unknown, errorMessage: string) {
	const r = result as { success?: boolean; error?: string } | null;
	if (!r || r.success !== true) {
		throw new Error(r?.error || errorMessage);
	}
	return r;
}

/**
 * Not Found 에러 여부 확인 (PGRST116)
 * @param error - 확인할 에러
 */
export function isNotFoundError(error: unknown): boolean {
	return (error as { code?: string })?.code === 'PGRST116';
}
