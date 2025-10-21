/**
 * 테스트 결과 데이터 파싱 유틸리티
 */

/**
 * 문자열 또는 배열을 문자열 배열로 변환하는 공통 함수
 */
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

/**
 * Description을 줄 단위로 파싱
 */
export function parseDescription(desc: string): string[] {
	return desc.split('\n').filter((line) => line.trim());
}

/**
 * 선물 데이터 파싱
 */
export function parseGifts(giftData: string | string[]): string[] {
	return parseStringOrArray(giftData);
}

/**
 * 궁합 데이터 파싱
 */
export function parseCompatibility(compatibilityData: string | string[]): string[] {
	return parseStringOrArray(compatibilityData);
}

/**
 * 직업 데이터 파싱
 */
export function parseJobs(jobData: string | string[]): string[] {
	return parseStringOrArray(jobData);
}
