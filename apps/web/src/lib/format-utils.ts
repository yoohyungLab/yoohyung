// 문자열 또는 배열을 문자열 배열로 변환하는 공통 함수 (4곳 사용 - 유지)
export function parseStringOrArray(data: string | string[]): string[] {
	if (Array.isArray(data)) {
		return data.filter((item) => item && item.trim().length > 0);
	}
	if (typeof data === 'string') {
		return data
			.split(',')
			.map((item) => item.trim())
			.filter((item) => item.length > 0);
	}
	return [];
}
