// 날짜 및 시간 포맷팅 유틸리티

// 날짜 포맷팅
export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

// 날짜 및 시간 포맷팅
export function formatDateTime(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleString('ko-KR', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

// 문자열 또는 배열을 문자열 배열로 변환하는 공통 함수
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

// Description을 줄 단위로 파싱
export function parseDescription(desc: string): string[] {
	return desc.split('\n').filter((line) => line.trim());
}
