export function validateRpcResult(result: unknown, errorMessage: string) {
	const r = result as { success?: boolean; error?: string } | null;
	if (!r || r.success !== true) {
		throw new Error(r?.error || errorMessage);
	}
	return r;
}
