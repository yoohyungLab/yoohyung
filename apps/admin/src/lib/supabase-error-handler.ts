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
