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
